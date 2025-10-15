"""
Book schemas for request and response validation.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class BookBase(BaseModel):
    """Base schema for Book with common fields"""
    isbn: str = Field(..., min_length=10, max_length=13, description="ISBN-10 or ISBN-13")
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    publisher: Optional[str] = Field(None, max_length=255)
    publication_year: Optional[int] = Field(None, ge=1000, le=9999)
    category: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    
    @field_validator('isbn')
    @classmethod
    def validate_isbn(cls, v: str) -> str:
        """Validate ISBN format"""
        # Remove hyphens and spaces
        isbn = v.replace('-', '').replace(' ', '')
        if len(isbn) not in [10, 13]:
            raise ValueError('ISBN must be 10 or 13 characters long')
        if not isbn.isdigit():
            raise ValueError('ISBN must contain only digits')
        return isbn


class BookCreate(BookBase):
    """Schema for creating a new book"""
    total_copies: int = Field(1, ge=1, description="Initial number of copies")
    available_copies: Optional[int] = Field(None, ge=0, description="Initially available copies")
    
    @field_validator('available_copies')
    @classmethod
    def validate_available_copies(cls, v: Optional[int], info) -> Optional[int]:
        """Ensure available_copies doesn't exceed total_copies"""
        if v is not None and 'total_copies' in info.data:
            if v > info.data['total_copies']:
                raise ValueError('available_copies cannot exceed total_copies')
        return v


class BookUpdate(BaseModel):
    """Schema for updating a book (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    publisher: Optional[str] = Field(None, max_length=255)
    publication_year: Optional[int] = Field(None, ge=1000, le=9999)
    category: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    total_copies: Optional[int] = Field(None, ge=1)
    available_copies: Optional[int] = Field(None, ge=0)


class BookResponse(BookBase):
    """Schema for book response"""
    id: int
    total_copies: int
    available_copies: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BookListResponse(BaseModel):
    """Schema for paginated book list response"""
    items: list[BookResponse]
    total: int
    page: int
    page_size: int
    pages: int
