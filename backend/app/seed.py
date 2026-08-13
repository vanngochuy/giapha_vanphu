import os
import openpyxl
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from .models import FamilyMember

def parse_and_seed_excel(excel_path: str = "GiaPha_VanPhu.xlsx", db: Session = None):
    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        # Create tables
        Base.metadata.create_all(bind=engine)

        if not os.path.exists(excel_path):
            # Fallback path if run from inside backend/
            parent_excel = os.path.join(os.path.dirname(__file__), "..", "..", "GiaPha_VanPhu.xlsx")
            if os.path.exists(parent_excel):
                excel_path = parent_excel
            else:
                print(f"Warning: Excel file {excel_path} not found.")
                return

        wb = openpyxl.load_workbook(excel_path)
        sheet = wb.active

        rows = list(sheet.iter_rows(values_only=True))[1:] # Skip header
        name_to_id = {}
        parsed_records = []

        for row in rows:
            if not row or row[0] is None:
                continue
            stt = int(row[0])
            gen = int(row[1]) if row[1] is not None else 1
            order_in_family = int(row[2]) if row[2] is not None else None
            full_name = str(row[3]).strip() if row[3] else f"Thành viên {stt}"
            gender = str(row[4]).strip() if row[4] else None
            spouse = str(row[5]).strip() if row[5] else None
            notes = str(row[6]).strip() if row[6] else None
            parent_name = str(row[7]).strip() if row[7] else None
            branch_name = str(row[8]).strip() if row[8] else None

            member_id = f"VP-{stt:03d}"
            name_to_id[full_name] = member_id

            # Parse status & notes
            status = "Còn sống"
            if notes and ("chết" in notes.lower() or "đã mất" in notes.lower()):
                status = "Đã mất"

            parsed_records.append({
                "id": member_id,
                "stt": stt,
                "generation": gen,
                "order_in_family": order_in_family,
                "full_name": full_name,
                "gender": gender,
                "spouse": spouse,
                "notes": notes,
                "parent_name": parent_name,
                "branch_name": branch_name,
                "status": status
            })

        # Link parent IDs
        for r in parsed_records:
            pname = r["parent_name"]
            parent_id = None
            if pname and pname != "(Thuỷ tổ)":
                if pname in name_to_id:
                    parent_id = name_to_id[pname]
                else:
                    # Better fallback: Exact match ignoring case
                    normalized_pname = pname.strip().lower()
                    matches = [k for k in name_to_id.keys() if k.strip().lower() == normalized_pname]
                    if matches:
                        parent_id = name_to_id[matches[0]]
                    else:
                        print(f"Warning: Could not link parent '{pname}' for '{r['full_name']}' (ID: {r['id']})")
            
            # Upsert into database
            db_member = db.query(FamilyMember).filter(FamilyMember.id == r["id"]).first()
            if not db_member:
                db_member = FamilyMember(
                    id=r["id"],
                    parent_id=parent_id,
                    full_name=r["full_name"],
                    generation=r["generation"],
                    order_in_family=r["order_in_family"],
                    gender=r["gender"],
                    spouse=r["spouse"],
                    branch_name=r["branch_name"],
                    status=r["status"],
                    notes=r["notes"]
                )
                db.add(db_member)
            else:
                db_member.parent_id = parent_id
                db_member.full_name = r["full_name"]
                db_member.generation = r["generation"]
                db_member.order_in_family = r["order_in_family"]
                db_member.gender = r["gender"]
                db_member.spouse = r["spouse"]
                db_member.branch_name = r["branch_name"]
                db_member.status = r["status"]
                db_member.notes = r["notes"]

        db.commit()
        print(f"Successfully seeded {len(parsed_records)} members into database.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        if close_session:
            db.close()

if __name__ == "__main__":
    parse_and_seed_excel()
