"""
Book model for the library management system.

This module defines the Book entity with all its attributes and business logic
for managing book availability and inventory.
"""

from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.loan import Loan


class Book(SQLModel, table=True):
    """
    Book model representing a book in the library.
    
    Attributes:
        id: Primary key
        isbn: International Standard Book Number (unique)
        title: Book title
        author: Book author
        publisher: Publishing company
        publication_year: Year of publication
        category: Book category/genre
        description: Book description
        total_copies: Total number of copies owned by library
        available_copies: Number of copies currently available
        created_at: Timestamp of creation
        updated_at: Timestamp of last update
    
    Business Rules:
        - ISBN must be unique
        - available_copies cannot exceed total_copies
        - available_copies cannot be negative
    """
    
    __tablename__ = "books"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    isbn: str = Field(unique=True, index=True, max_length=13, description="ISBN-10 or ISBN-13")
    title: str = Field(index=True, max_length=255, min_length=1)
    author: str = Field(index=True, max_length=255, min_length=1)
    publisher: Optional[str] = Field(default=None, max_length=255)
    publication_year: Optional[int] = Field(default=None, ge=1000, le=9999)
    category: str = Field(index=True, max_length=100)
    description: Optional[str] = Field(default=None, max_length=2000)
    total_copies: int = Field(default=1, ge=1, description="Total copies in library")
    available_copies: int = Field(default=1, ge=0, description="Currently available copies")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    loans: list["Loan"] = Relationship(back_populates="book")
    
    def is_available(self) -> bool:
        """
        Check if the book has copies available for checkout.
        
        Returns:
            bool: True if at least one copy is available
        """
        return self.available_copies > 0
    
    def checkout(self) -> None:
        """
        Decrease available copies when a book is checked out.
        
        Raises:
            ValueError: If no copies are available
        """
        if self.available_copies <= 0:
            raise ValueError(f"No copies of '{self.title}' available for checkout")
        self.available_copies -= 1
        self.updated_at = datetime.utcnow()
    
    def return_book(self) -> None:
        """
        Increase available copies when a book is returned.
        
        Raises:
            ValueError: If available copies would exceed total copies
        """
        if self.available_copies >= self.total_copies:
            raise ValueError(f"Cannot return book: available copies already at maximum")
        self.available_copies += 1
        self.updated_at = datetime.utcnow()
    
    def add_copies(self, count: int) -> None:
        """
        Add new copies to the library inventory.
        
        Args:
            count: Number of copies to add
        
        Raises:
            ValueError: If count is not positive
        """
        if count <= 0:
            raise ValueError("Count must be positive")
        self.total_copies += count
        self.available_copies += count
        self.updated_at = datetime.utcnow()
    
    def remove_copies(self, count: int) -> None:
        """
        Remove copies from the library inventory.
        
        Args:
            count: Number of copies to remove
        
        Raises:
            ValueError: If count exceeds available copies or is not positive
        """
        if count <= 0:
            raise ValueError("Count must be positive")
        if count > self.available_copies:
            raise ValueError(f"Cannot remove {count} copies: only {self.available_copies} available")
        self.total_copies -= count
        self.available_copies -= count
        self.updated_at = datetime.utcnow()
    
    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "isbn": "9780132350884",
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "publisher": "Prentice Hall",
                "publication_year": 2008,
                "category": "Software Engineering",
                "description": "A Handbook of Agile Software Craftsmanship",
                "total_copies": 5,
                "available_copies": 3
            }
        }
