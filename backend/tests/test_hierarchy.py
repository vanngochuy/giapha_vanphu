import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.database import Base
from backend.app.models import FamilyMember
from backend.app.crud import get_hierarchy_tree, get_member, create_member, delete_member
from backend.app.schemas import MemberCreate
from backend.app.seed import parse_and_seed_excel

TEST_DATABASE_URL = "sqlite:///./test_gia_pha.db"

@pytest.fixture(scope="module")
def test_db():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    
    # Seed data
    excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "GiaPha_VanPhu.xlsx"))
    parse_and_seed_excel(excel_path=excel_path, db=db)
    
    yield db
    
    db.close()
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_gia_pha.db"):
        try:
            os.remove("./test_gia_pha.db")
        except PermissionError:
            pass

def test_total_member_count(test_db):
    count = test_db.query(FamilyMember).count()
    assert count == 106, f"Expected 106 members, got {count}"

def test_root_ancestor(test_db):
    thuy_to = get_member(test_db, "VP-001")
    assert thuy_to is not None
    assert thuy_to.full_name == "Ông Văn Phú Dưỡng"
    assert thuy_to.parent_id is None
    assert thuy_to.generation == 1

def test_recursive_cte_tree(test_db):
    tree = get_hierarchy_tree(test_db)
    assert len(tree) >= 1
    root = tree[0]
    assert root['id'] == "VP-001"
    assert 'children' in root
    assert len(root['children']) > 0
    
    # Check generation 2 child
    gen2_child = root['children'][0]
    assert gen2_child['full_name'] == "Ông Văn Phú Hưng"
    assert gen2_child['generation'] == 2
    assert len(gen2_child['children']) > 0

def test_crud_operations(test_db):
    # Test Create
    new_member = MemberCreate(
        id="VP-999",
        parent_id="VP-001",
        full_name="Thành Viên Test",
        generation=2,
        gender="Nam",
        status="Còn sống"
    )
    created = create_member(test_db, new_member)
    assert created.id == "VP-999"
    assert created.full_name == "Thành Viên Test"

    # Test Delete
    success = delete_member(test_db, "VP-999")
    assert success is True
    assert get_member(test_db, "VP-999") is None
