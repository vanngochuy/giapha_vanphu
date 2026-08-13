from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(String(20), primary_key=True, index=True) # e.g. 'VP-001'
    parent_id = Column(String(20), ForeignKey("family_members.id"), nullable=True, index=True)
    full_name = Column(String(100), nullable=False, index=True)
    generation = Column(Integer, nullable=False, index=True) # 1, 2, 3...
    order_in_family = Column(Integer, nullable=True) # 1, 2, 3...
    gender = Column(String(10), nullable=True) # Nam / Nữ
    spouse = Column(String(250), nullable=True) # Vợ / Chồng
    branch_name = Column(String(100), nullable=True) # E.g., 'Nhánh Ông Văn Phú Nọc'
    status = Column(String(20), default="Còn sống") # 'Còn sống' / 'Đã mất'
    birth_year = Column(String(20), nullable=True)
    death_date_lunar = Column(String(50), nullable=True) # Ngày giỗ âm lịch
    burial_place = Column(Text, nullable=True) # Nơi an táng / mộ phần
    notes = Column(Text, nullable=True) # Ghi chú sinh hoạt, nơi ở, tiểu sử

    # Relationships for self-referencing hierarchy
    parent = relationship("FamilyMember", remote_side=[id], backref="children")

    def to_dict(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "full_name": self.full_name,
            "generation": self.generation,
            "order_in_family": self.order_in_family,
            "gender": self.gender,
            "spouse": self.spouse,
            "branch_name": self.branch_name,
            "status": self.status,
            "birth_year": self.birth_year,
            "death_date_lunar": self.death_date_lunar,
            "burial_place": self.burial_place,
            "notes": self.notes
        }
