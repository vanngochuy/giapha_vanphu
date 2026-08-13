import os
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from .database import engine, Base, get_db, SessionLocal
from .models import FamilyMember
from .schemas import MemberResponse, MemberCreate, MemberUpdate
from .crud import get_member, get_members, get_hierarchy_tree, create_member, update_member, delete_member
from .seed import parse_and_seed_excel

# Create Database tables
Base.metadata.create_all(bind=engine)

# Auto seed if empty
db = SessionLocal()
try:
    if db.query(FamilyMember).count() == 0:
        print("Database empty. Auto seeding from Excel file...")
        parse_and_seed_excel(db=db)
finally:
    db.close()

app = FastAPI(
    title="Gia Phả Họ Văn Phú API",
    description="API Quản lý & Hiển thị Cây Gia Phả Họ Văn Phú (PostgreSQL/SQLite CTE Recursive)",
    version="1.0.0"
)

# Enable CORS for web deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": "Gia Phả Họ Văn Phú Web System",
        "version": "1.0.0"
    }

@app.get("/api/members/tree", tags=["Members"])
def get_family_tree(db: Session = Depends(get_db)):
    """
    Returns full hierarchical family tree JSON structure using WITH RECURSIVE CTE.
    """
    tree = get_hierarchy_tree(db)
    return {
        "success": True,
        "count": len(tree),
        "data": tree
    }

@app.get("/api/members", response_model=List[MemberResponse], tags=["Members"])
def list_members(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    """
    Lists all family members sorted by generation and family order.
    """
    return get_members(db, skip=skip, limit=limit)

@app.get("/api/members/{member_id}", response_model=MemberResponse, tags=["Members"])
def read_member(member_id: str, db: Session = Depends(get_db)):
    member = get_member(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Thành viên không tồn tại")
    return member

@app.post("/api/members", response_model=MemberResponse, status_code=status.HTTP_201_CREATED, tags=["Members"])
def add_member(member: MemberCreate, db: Session = Depends(get_db)):
    existing = get_member(db, member.id)
    if existing:
        raise HTTPException(status_code=400, detail="Mã thành viên (ID) đã tồn tại")
    return create_member(db, member)

@app.put("/api/members/{member_id}", response_model=MemberResponse, tags=["Members"])
def edit_member(member_id: str, member_data: MemberUpdate, db: Session = Depends(get_db)):
    updated = update_member(db, member_id, member_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Thành viên không tồn tại")
    return updated

@app.delete("/api/members/{member_id}", tags=["Members"])
def remove_member(member_id: str, db: Session = Depends(get_db)):
    success = delete_member(db, member_id)
    if not success:
        raise HTTPException(status_code=404, detail="Thành viên không tồn tại")
    return {"success": True, "message": f"Đã xóa thành viên {member_id}"}

# Serve Frontend static files if frontend folder exists
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend():
        return FileResponse(os.path.join(frontend_dir, "index.html"))
