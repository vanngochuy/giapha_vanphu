from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class MemberBase(BaseModel):
    id: str
    parent_id: Optional[str] = None
    full_name: str
    generation: int
    order_in_family: Optional[int] = None
    gender: Optional[str] = None
    spouse: Optional[str] = None
    branch_name: Optional[str] = None
    status: Optional[str] = "Còn sống"
    birth_year: Optional[str] = None
    death_date_lunar: Optional[str] = None
    burial_place: Optional[str] = None
    notes: Optional[str] = None

class MemberCreate(MemberBase):
    pass

class MemberUpdate(BaseModel):
    parent_id: Optional[str] = None
    full_name: Optional[str] = None
    generation: Optional[int] = None
    order_in_family: Optional[int] = None
    gender: Optional[str] = None
    spouse: Optional[str] = None
    branch_name: Optional[str] = None
    status: Optional[str] = None
    birth_year: Optional[str] = None
    death_date_lunar: Optional[str] = None
    burial_place: Optional[str] = None
    notes: Optional[str] = None

class MemberResponse(MemberBase):
    model_config = ConfigDict(from_attributes=True)

class TreeMember(MemberResponse):
    children: List['TreeMember'] = []

if hasattr(TreeMember, "model_rebuild"):
    TreeMember.model_rebuild()
elif hasattr(TreeMember, "update_forward_refs"):
    TreeMember.update_forward_refs()
