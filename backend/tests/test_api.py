import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.main import app
from backend.app.database import Base, get_db
from backend.app.seed import parse_and_seed_excel

TEST_DATABASE_URL = "sqlite:///./test_api_gia_pha.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "GiaPha_VanPhu.xlsx"))
    parse_and_seed_excel(excel_path=excel_path, db=db)
    db.close()
    
    yield
    
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_api_gia_pha.db"):
        try:
            os.remove("./test_api_gia_pha.db")
        except PermissionError:
            pass

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_api_get_members():
    response = client.get("/api/members")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 106

def test_api_get_member():
    response = client.get("/api/members/VP-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "VP-001"
    assert data["full_name"] == "Ông Văn Phú Dưỡng"
    assert data["parent_id"] is None

def test_api_get_tree():
    response = client.get("/api/members/tree")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] >= 1
    tree = data["data"]
    assert len(tree) >= 1
    assert tree[0]["id"] == "VP-001"
    assert "children" in tree[0]

def test_api_create_member():
    payload = {
        "id": "VP-TEST1",
        "parent_id": "VP-001",
        "full_name": "Test Child API",
        "generation": 2,
        "gender": "Nữ",
        "status": "Còn sống"
    }
    response = client.post("/api/members", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == "VP-TEST1"
    assert data["full_name"] == "Test Child API"

def test_api_update_member():
    payload = {
        "full_name": "Test Child API Updated",
        "notes": "Updated notes via API"
    }
    response = client.put("/api/members/VP-TEST1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "VP-TEST1"
    assert data["full_name"] == "Test Child API Updated"
    assert data["notes"] == "Updated notes via API"

def test_api_delete_member():
    response = client.delete("/api/members/VP-TEST1")
    assert response.status_code == 200
    assert response.json()["success"] is True

    # Verify deletion
    response2 = client.get("/api/members/VP-TEST1")
    assert response2.status_code == 404
