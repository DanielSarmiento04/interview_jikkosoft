"""
Books API endpoints.

This module provides CRUD operations for books including
search, filtering, and pagination capabilities.
"""

from typing import Optional
from sqlmodel import Session, select, or_, col
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.database import get_session
from app.models.book import Book
from app.schemas.book import (
    BookCreate,
    BookUpdate,
    BookResponse,
    BookListResponse,
)
import math

router = APIRouter(prefix="/books", tags=["books"])


@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    book_data: BookCreate,
    session: Session = Depends(get_session)
) -> Book:
    """
    Create a new book in the library.
    
    Args:
        book_data: Book creation data
        session: Database session
    
    Returns:
        BookResponse: Created book
    
    Raises:
        HTTPException 400: If ISBN already exists
    """
    # Check if ISBN already exists
    statement = select(Book).where(Book.isbn == book_data.isbn)
    existing_book = session.exec(statement).first()
    
    if existing_book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Book with ISBN {book_data.isbn} already exists"
        )
    
    # Create book
    book_dict = book_data.model_dump()
    
    # Set available_copies to total_copies if not provided
    if book_dict.get('available_copies') is None:
        book_dict['available_copies'] = book_dict['total_copies']
    
    book = Book(**book_dict)
    session.add(book)
    session.commit()
    session.refresh(book)
    
    return book


@router.get("/", response_model=BookListResponse)
def get_books(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in title, author, or category"),
    category: Optional[str] = Query(None, description="Filter by category"),
    available_only: bool = Query(False, description="Show only available books"),
    session: Session = Depends(get_session)
) -> BookListResponse:
    """
    Get a paginated list of books with optional filtering.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        search: Search term for title, author, or category
        category: Filter by specific category
        available_only: Only show books with available copies
        session: Database session
    
    Returns:
        BookListResponse: Paginated book list
    """
    # Build query
    statement = select(Book)
    
    # Apply filters
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            or_(
                Book.title.ilike(search_pattern),  # type: ignore
                Book.author.ilike(search_pattern),  # type: ignore
                Book.category.ilike(search_pattern)  # type: ignore
            )
        )
    
    if category:
        statement = statement.where(Book.category == category)
    
    if available_only:
        statement = statement.where(Book.available_copies > 0)
    
    # Get total count
    total = len(list(session.exec(statement).all()))
    
    # Apply pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    books = session.exec(statement).all()
    
    return BookListResponse(
        items=list(books),
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 0
    )


@router.get("/{book_id}", response_model=BookResponse)
def get_book(
    book_id: int,
    session: Session = Depends(get_session)
) -> Book:
    """
    Get a specific book by ID.
    
    Args:
        book_id: Book ID
        session: Database session
    
    Returns:
        BookResponse: Book details
    
    Raises:
        HTTPException 404: If book not found
    """
    book = session.get(Book, book_id)
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found"
        )
    
    return book


@router.get("/isbn/{isbn}", response_model=BookResponse)
def get_book_by_isbn(
    isbn: str,
    session: Session = Depends(get_session)
) -> Book:
    """
    Get a book by ISBN.
    
    Args:
        isbn: ISBN number
        session: Database session
    
    Returns:
        BookResponse: Book details
    
    Raises:
        HTTPException 404: If book not found
    """
    # Clean ISBN
    isbn_clean = isbn.replace('-', '').replace(' ', '')
    
    statement = select(Book).where(Book.isbn == isbn_clean)
    book = session.exec(statement).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ISBN {isbn} not found"
        )
    
    return book


@router.put("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_data: BookUpdate,
    session: Session = Depends(get_session)
) -> Book:
    """
    Update a book's information.
    
    Args:
        book_id: Book ID
        book_data: Updated book data
        session: Database session
    
    Returns:
        BookResponse: Updated book
    
    Raises:
        HTTPException 404: If book not found
        HTTPException 400: If update violates constraints
    """
    book = session.get(Book, book_id)
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found"
        )
    
    # Update only provided fields
    update_data = book_data.model_dump(exclude_unset=True)
    
    # Validate available_copies if being updated
    if 'available_copies' in update_data:
        total = update_data.get('total_copies', book.total_copies)
        available = update_data['available_copies']
        if available > total:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="available_copies cannot exceed total_copies"
            )
    
    for key, value in update_data.items():
        setattr(book, key, value)
    
    session.commit()
    session.refresh(book)
    
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    session: Session = Depends(get_session)
) -> None:
    """
    Delete a book from the library.
    
    Args:
        book_id: Book ID
        session: Database session
    
    Raises:
        HTTPException 404: If book not found
        HTTPException 400: If book has active loans
    """
    book = session.get(Book, book_id)
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found"
        )
    
    # Check for active loans
    active_loans = [loan for loan in book.loans if loan.return_date is None]
    if active_loans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete book: {len(active_loans)} active loan(s) exist"
        )
    
    session.delete(book)
    session.commit()


@router.get("/available/list", response_model=BookListResponse)
def get_available_books(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session)
) -> BookListResponse:
    """
    Get all books that have available copies.
    
    Args:
        page: Page number
        page_size: Items per page
        session: Database session
    
    Returns:
        BookListResponse: Paginated list of available books
    """
    statement = select(Book).where(Book.available_copies > 0)
    
    total = len(list(session.exec(statement).all()))
    
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    books = session.exec(statement).all()
    
    return BookListResponse(
        items=list(books),
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 0
    )
