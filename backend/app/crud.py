from sqlalchemy.orm import Session
from sqlalchemy import text
from .models import FamilyMember
from .schemas import MemberCreate, MemberUpdate

def _to_dict(model_instance):
    if hasattr(model_instance, "model_dump"):
        return model_instance.model_dump()
    return model_instance.dict()

def get_member(db: Session, member_id: str):
    return db.query(FamilyMember).filter(FamilyMember.id == member_id).first()

def get_members(db: Session, skip: int = 0, limit: int = 200):
    return db.query(FamilyMember).order_by(FamilyMember.generation, FamilyMember.order_in_family).offset(skip).limit(limit).all()

def get_hierarchy_tree(db: Session):
    """
    Executes PostgreSQL / SQLite WITH RECURSIVE CTE to fetch hierarchical family tree.
    Returns nested tree structure rooted at Thuy To (parent_id IS NULL).
    """
    cte_query = text("""
        WITH RECURSIVE family_tree AS (
            -- Base case: Root members (parent_id IS NULL)
            SELECT 
                id, parent_id, full_name, generation, order_in_family,
                gender, spouse, branch_name, status, birth_year,
                death_date_lunar, burial_place, notes, 0 as level
            FROM family_members
            WHERE parent_id IS NULL
            
            UNION ALL
            
            -- Recursive step: Children linked by parent_id
            SELECT 
                m.id, m.parent_id, m.full_name, m.generation, m.order_in_family,
                m.gender, m.spouse, m.branch_name, m.status, m.birth_year,
                m.death_date_lunar, m.burial_place, m.notes, ft.level + 1
            FROM family_members m
            INNER JOIN family_tree ft ON m.parent_id = ft.id
        )
        SELECT * FROM family_tree ORDER BY generation ASC, order_in_family ASC;
    """)

    result = db.execute(cte_query).fetchall()

    nodes_by_id = {}
    roots = []

    for row in result:
        node_data = dict(row._mapping) if hasattr(row, '_mapping') else dict(row)
        node_data['children'] = []
        nodes_by_id[node_data['id']] = node_data

    for node_id, node in nodes_by_id.items():
        parent_id = node['parent_id']
        if parent_id and parent_id in nodes_by_id:
            nodes_by_id[parent_id]['children'].append(node)
        else:
            roots.append(node)

    return roots

def create_member(db: Session, member: MemberCreate):
    db_member = FamilyMember(**_to_dict(member))
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_member(db: Session, member_id: str, member_data: MemberUpdate):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    update_data = _to_dict(member_data)
    for key, value in update_data.items():
        if value is not None:
            setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: str):
    db_member = get_member(db, member_id)
    if not db_member:
        return False
    db.delete(db_member)
    db.commit()
    return True
