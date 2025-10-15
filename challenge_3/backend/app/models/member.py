"""
Member model for the library management system.

This module defines the Member entity representing library members
with membership management and loan validation capabilities.
"""

from typing import Optional, TYPE_CHECKING
from datetime import datetime, timedelta
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.loan import Loan


class MembershipStatus(str, Enum):
    """Membership status enumeration"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    EXPIRED = "expired"


class Member(SQLModel, table=True):
    """
    Member model representing a library member.
    
    Attributes:
        id: Primary key
        member_number: Unique member identification number
        name: Member's full name
        email: Member's email address (unique)
        phone: Contact phone number
        address: Physical address
        membership_date: Date when membership started
        membership_expiry: Date when membership expires
        status: Current membership status
        max_loans: Maximum number of simultaneous loans allowed
        created_at: Timestamp of creation
        updated_at: Timestamp of last update
    
    Business Rules:
        - Only ACTIVE members can borrow books
        - Members cannot exceed their max_loans limit
        - Members with overdue books cannot borrow new books
    """
    
    __tablename__ = "members"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    member_number: str = Field(
        unique=True, 
        index=True, 
        max_length=20,
        description="Unique member identification number"
    )
    name: str = Field(index=True, max_length=255, min_length=1)
    email: str = Field(unique=True, index=True, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    address: Optional[str] = Field(default=None, max_length=500)
    membership_date: datetime = Field(default_factory=datetime.utcnow)
    membership_expiry: Optional[datetime] = None
    status: MembershipStatus = Field(default=MembershipStatus.ACTIVE)
    max_loans: int = Field(default=3, ge=1, le=10, description="Maximum simultaneous loans")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    loans: list["Loan"] = Relationship(back_populates="member")
    
    def can_borrow(self) -> bool:
        """
        Check if the member is eligible to borrow books.
        
        Returns:
            bool: True if member can borrow, False otherwise
        """
        if self.status != MembershipStatus.ACTIVE:
            return False
        
        if self.membership_expiry and self.membership_expiry < datetime.utcnow():
            return False
        
        # Count active loans
        active_loans = sum(1 for loan in self.loans if loan.return_date is None)
        if active_loans >= self.max_loans:
            return False
        
        return True
    
    def has_overdue_books(self) -> bool:
        """
        Check if the member has any overdue books.
        
        Returns:
            bool: True if member has overdue books
        """
        return any(loan.is_overdue() for loan in self.loans if loan.return_date is None)
    
    def get_active_loans_count(self) -> int:
        """
        Get the count of currently active loans.
        
        Returns:
            int: Number of active loans
        """
        return sum(1 for loan in self.loans if loan.return_date is None)
    
    def suspend(self, reason: Optional[str] = None) -> None:
        """
        Suspend the member's account.
        
        Args:
            reason: Optional reason for suspension
        """
        self.status = MembershipStatus.SUSPENDED
        self.updated_at = datetime.utcnow()
    
    def activate(self) -> None:
        """Activate the member's account."""
        self.status = MembershipStatus.ACTIVE
        self.updated_at = datetime.utcnow()
    
    def renew_membership(self, months: int = 12) -> None:
        """
        Renew the membership for a specified period.
        
        Args:
            months: Number of months to extend membership (default: 12)
        """
        if self.membership_expiry and self.membership_expiry > datetime.utcnow():
            # Extend from current expiry
            self.membership_expiry += timedelta(days=30 * months)
        else:
            # Start from today
            self.membership_expiry = datetime.utcnow() + timedelta(days=30 * months)
        
        self.status = MembershipStatus.ACTIVE
        self.updated_at = datetime.utcnow()
    
    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "member_number": "MEM2024001",
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country",
                "status": "active",
                "max_loans": 3
            }
        }
