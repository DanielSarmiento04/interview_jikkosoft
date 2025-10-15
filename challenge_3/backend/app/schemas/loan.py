"""
Loan schemas for request and response validation.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class LoanBase(BaseModel):
    """Base schema for Loan"""
    book_id: int = Field(..., gt=0)
    member_id: int = Field(..., gt=0)


class LoanCreate(LoanBase):
    """Schema for creating a new loan (checkout)"""
    due_date: Optional[datetime] = None  # Auto-calculated if not provided


class LoanResponse(LoanBase):
    """Schema for loan response"""
    id: int
    checkout_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    renewal_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LoanWithDetails(LoanResponse):
    """Loan response with book and member details"""
    book_title: Optional[str] = None
    book_author: Optional[str] = None
    member_name: Optional[str] = None
    member_number: Optional[str] = None
    is_overdue: bool = False
    days_overdue: int = 0


class LoanReturnRequest(BaseModel):
    """Schema for returning a book"""
    return_date: Optional[datetime] = None  # Auto-set to now if not provided


class LoanRenewalResponse(BaseModel):
    """Schema for loan renewal response"""
    id: int
    new_due_date: datetime
    renewal_count: int
    message: str


class LoanListResponse(BaseModel):
    """Schema for paginated loan list response"""
    items: list[LoanWithDetails]
    total: int
    page: int
    page_size: int
    pages: int


class LoanStatistics(BaseModel):
    """Schema for loan statistics"""
    total_loans: int
    active_loans: int
    overdue_loans: int
    completed_loans: int
    total_renewals: int
