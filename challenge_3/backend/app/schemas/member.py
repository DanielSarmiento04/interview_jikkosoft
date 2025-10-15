"""
Member schemas for request and response validation.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, field_validator
from app.models.member import MembershipStatus


class MemberBase(BaseModel):
    """Base schema for Member with common fields"""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)


class MemberCreate(MemberBase):
    """Schema for creating a new member"""
    member_number: Optional[str] = Field(None, max_length=20, description="Auto-generated if not provided")
    max_loans: int = Field(3, ge=1, le=10, description="Maximum simultaneous loans")
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Basic phone validation"""
        if v is not None:
            # Remove common separators
            cleaned = v.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')
            if not cleaned.replace('+', '').isdigit():
                raise ValueError('Phone number must contain only digits and optional + prefix')
        return v


class MemberUpdate(BaseModel):
    """Schema for updating a member (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)
    max_loans: Optional[int] = Field(None, ge=1, le=10)
    status: Optional[MembershipStatus] = None


class MemberResponse(MemberBase):
    """Schema for member response"""
    id: int
    member_number: str
    membership_date: datetime
    membership_expiry: Optional[datetime]
    status: MembershipStatus
    max_loans: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MemberWithStats(MemberResponse):
    """Member response with additional statistics"""
    active_loans_count: int = 0
    total_loans_count: int = 0
    has_overdue: bool = False


class MemberListResponse(BaseModel):
    """Schema for paginated member list response"""
    items: list[MemberResponse]
    total: int
    page: int
    page_size: int
    pages: int
