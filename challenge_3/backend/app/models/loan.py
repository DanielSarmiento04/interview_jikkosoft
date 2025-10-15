"""
Loan model for the library management system.

This module defines the Loan entity representing book loans to members,
including checkout, return, and renewal operations.
"""

from typing import Optional, TYPE_CHECKING, ClassVar
from datetime import datetime, timedelta
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.book import Book
    from app.models.member import Member


class Loan(SQLModel, table=True):
    """
    Loan model representing a book loan transaction.
    
    Attributes:
        id: Primary key
        book_id: Foreign key to Book
        member_id: Foreign key to Member
        checkout_date: Date when book was checked out
        due_date: Date when book should be returned
        return_date: Actual return date (None if not returned)
        renewal_count: Number of times loan has been renewed
        created_at: Timestamp of creation
        updated_at: Timestamp of last update
    
    Business Rules:
        - A loan cannot be renewed more than MAX_RENEWALS times
        - Overdue books cannot be renewed
        - Return date cannot be before checkout date
    """
    
    __tablename__ = "loans"
    
    # Constants (ClassVar to exclude from model fields)
    DEFAULT_LOAN_DAYS: ClassVar[int] = 14
    MAX_RENEWALS: ClassVar[int] = 2
    RENEWAL_DAYS: ClassVar[int] = 7
    
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="books.id", index=True)
    member_id: int = Field(foreign_key="members.id", index=True)
    checkout_date: datetime = Field(default_factory=datetime.utcnow, index=True)
    due_date: datetime = Field(index=True)
    return_date: Optional[datetime] = Field(default=None)
    renewal_count: int = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    book: Optional["Book"] = Relationship(back_populates="loans")
    member: Optional["Member"] = Relationship(back_populates="loans")
    
    def __init__(self, **data):
        """Initialize loan with default due date if not provided."""
        if 'due_date' not in data:
            checkout_date = data.get('checkout_date', datetime.utcnow())
            data['due_date'] = checkout_date + timedelta(days=self.DEFAULT_LOAN_DAYS)
        super().__init__(**data)
    
    def is_overdue(self) -> bool:
        """
        Check if the loan is overdue.
        
        Returns:
            bool: True if book is overdue and not yet returned
        """
        if self.return_date is not None:
            return False
        return datetime.utcnow() > self.due_date
    
    def days_overdue(self) -> int:
        """
        Calculate the number of days the book is overdue.
        
        Returns:
            int: Number of days overdue (0 if not overdue)
        """
        if not self.is_overdue():
            return 0
        delta = datetime.utcnow() - self.due_date
        return delta.days
    
    def can_renew(self) -> bool:
        """
        Check if the loan can be renewed.
        
        Returns:
            bool: True if loan can be renewed
        """
        if self.return_date is not None:
            return False
        if self.renewal_count >= self.MAX_RENEWALS:
            return False
        if self.is_overdue():
            return False
        return True
    
    def renew(self) -> None:
        """
        Renew the loan by extending the due date.
        
        Raises:
            ValueError: If loan cannot be renewed
        """
        if not self.can_renew():
            reasons = []
            if self.return_date is not None:
                reasons.append("book already returned")
            if self.renewal_count >= self.MAX_RENEWALS:
                reasons.append(f"maximum renewals ({self.MAX_RENEWALS}) reached")
            if self.is_overdue():
                reasons.append("loan is overdue")
            
            raise ValueError(f"Cannot renew loan: {', '.join(reasons)}")
        
        self.due_date += timedelta(days=self.RENEWAL_DAYS)
        self.renewal_count += 1
        self.updated_at = datetime.utcnow()
    
    def return_book(self) -> None:
        """
        Mark the book as returned.
        
        Raises:
            ValueError: If book is already returned
        """
        if self.return_date is not None:
            raise ValueError("Book has already been returned")
        
        self.return_date = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def calculate_fine(self, fine_per_day: float = 1.0) -> float:
        """
        Calculate the late fee for overdue books.
        
        Args:
            fine_per_day: Amount to charge per day overdue
        
        Returns:
            float: Total fine amount
        """
        if not self.is_overdue():
            return 0.0
        return self.days_overdue() * fine_per_day
    
    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "book_id": 1,
                "member_id": 1,
                "checkout_date": "2024-01-01T10:00:00",
                "due_date": "2024-01-15T10:00:00",
                "renewal_count": 0
            }
        }
