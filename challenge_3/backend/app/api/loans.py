"""
Loans API endpoints.

This module provides loan management operations including
checkout, return, renewal, and overdue tracking.
"""

from typing import Optional
from datetime import datetime
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.database import get_session
from app.models.loan import Loan
from app.schemas.loan import (
    LoanCreate,
    LoanResponse,
    LoanWithDetails,
    LoanRenewalResponse,
    LoanListResponse,
    LoanStatistics,
)
from app.services.library_service import LibraryService
from app.api.deps import get_library_service
import math

router = APIRouter(prefix="/loans", tags=["loans"])


@router.post("/", response_model=LoanWithDetails, status_code=status.HTTP_201_CREATED)
def checkout_book(
    loan_data: LoanCreate,
    library_service: LibraryService = Depends(get_library_service),
) -> dict:
    """
    Checkout a book to a member.
    
    Args:
        loan_data: Loan creation data
        library_service: Library service instance
    
    Returns:
        LoanWithDetails: Created loan with details
    
    Raises:
        HTTPException 404: If book or member not found
        HTTPException 400: If checkout cannot be completed
    """
    loan = library_service.checkout_book(
        book_id=loan_data.book_id,
        member_id=loan_data.member_id,
        due_date=loan_data.due_date
    )
    
    # Build detailed response
    return {
        "id": loan.id,
        "book_id": loan.book_id,
        "member_id": loan.member_id,
        "checkout_date": loan.checkout_date,
        "due_date": loan.due_date,
        "return_date": loan.return_date,
        "renewal_count": loan.renewal_count,
        "created_at": loan.created_at,
        "updated_at": loan.updated_at,
        "book_title": loan.book.title if loan.book else None,
        "book_author": loan.book.author if loan.book else None,
        "member_name": loan.member.name if loan.member else None,
        "member_number": loan.member.member_number if loan.member else None,
        "is_overdue": loan.is_overdue(),
        "days_overdue": loan.days_overdue(),
    }


@router.get("/", response_model=LoanListResponse)
def get_loans(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    active_only: bool = Query(False, description="Show only active loans"),
    overdue_only: bool = Query(False, description="Show only overdue loans"),
    session: Session = Depends(get_session)
) -> LoanListResponse:
    """
    Get a paginated list of loans with optional filtering.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        active_only: Only show active (not returned) loans
        overdue_only: Only show overdue loans
        session: Database session
    
    Returns:
        LoanListResponse: Paginated loan list with details
    """
    statement = select(Loan)
    
    # Apply filters
    if active_only:
        statement = statement.where(Loan.return_date.is_(None))  # type: ignore
    
    if overdue_only:
        statement = statement.where(
            Loan.return_date.is_(None),  # type: ignore
            Loan.due_date < datetime.utcnow()
        )
    
    # Get total count
    total = len(list(session.exec(statement).all()))
    
    # Apply pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    loans = session.exec(statement).all()
    
    # Build detailed response
    items = []
    for loan in loans:
        item = {
            "id": loan.id,
            "book_id": loan.book_id,
            "member_id": loan.member_id,
            "checkout_date": loan.checkout_date,
            "due_date": loan.due_date,
            "return_date": loan.return_date,
            "renewal_count": loan.renewal_count,
            "created_at": loan.created_at,
            "updated_at": loan.updated_at,
            "book_title": loan.book.title if loan.book else None,
            "book_author": loan.book.author if loan.book else None,
            "member_name": loan.member.name if loan.member else None,
            "member_number": loan.member.member_number if loan.member else None,
            "is_overdue": loan.is_overdue(),
            "days_overdue": loan.days_overdue(),
        }
        items.append(item)
    
    return LoanListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 0
    )


@router.get("/overdue", response_model=list[LoanWithDetails])
def get_overdue_loans(
    library_service: LibraryService = Depends(get_library_service),
) -> list[dict]:
    """
    Get all overdue loans.
    
    Args:
        library_service: Library service instance
    
    Returns:
        list[LoanWithDetails]: List of overdue loans with details
    """
    loans = library_service.get_overdue_loans()
    
    result = []
    for loan in loans:
        loan_dict = {
            "id": loan.id,
            "book_id": loan.book_id,
            "member_id": loan.member_id,
            "checkout_date": loan.checkout_date,
            "due_date": loan.due_date,
            "return_date": loan.return_date,
            "renewal_count": loan.renewal_count,
            "created_at": loan.created_at,
            "updated_at": loan.updated_at,
            "book_title": loan.book.title if loan.book else None,
            "book_author": loan.book.author if loan.book else None,
            "member_name": loan.member.name if loan.member else None,
            "member_number": loan.member.member_number if loan.member else None,
            "is_overdue": True,
            "days_overdue": loan.days_overdue(),
        }
        result.append(loan_dict)
    
    return result


@router.get("/statistics", response_model=LoanStatistics)
def get_loan_statistics(
    session: Session = Depends(get_session)
) -> LoanStatistics:
    """
    Get loan statistics.
    
    Args:
        session: Database session
    
    Returns:
        LoanStatistics: Loan statistics
    """
    all_loans = session.exec(select(Loan)).all()
    
    total_loans = len(all_loans)
    active_loans = sum(1 for loan in all_loans if loan.return_date is None)
    overdue_loans = sum(1 for loan in all_loans if loan.is_overdue())
    completed_loans = sum(1 for loan in all_loans if loan.return_date is not None)
    total_renewals = sum(loan.renewal_count for loan in all_loans)
    
    return LoanStatistics(
        total_loans=total_loans,
        active_loans=active_loans,
        overdue_loans=overdue_loans,
        completed_loans=completed_loans,
        total_renewals=total_renewals,
    )


@router.get("/{loan_id}", response_model=LoanWithDetails)
def get_loan(
    loan_id: int,
    session: Session = Depends(get_session)
) -> dict:
    """
    Get a specific loan by ID.
    
    Args:
        loan_id: Loan ID
        session: Database session
    
    Returns:
        LoanWithDetails: Loan details
    
    Raises:
        HTTPException 404: If loan not found
    """
    loan = session.get(Loan, loan_id)
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Loan with id {loan_id} not found"
        )
    
    return {
        "id": loan.id,
        "book_id": loan.book_id,
        "member_id": loan.member_id,
        "checkout_date": loan.checkout_date,
        "due_date": loan.due_date,
        "return_date": loan.return_date,
        "renewal_count": loan.renewal_count,
        "created_at": loan.created_at,
        "updated_at": loan.updated_at,
        "book_title": loan.book.title if loan.book else None,
        "book_author": loan.book.author if loan.book else None,
        "member_name": loan.member.name if loan.member else None,
        "member_number": loan.member.member_number if loan.member else None,
        "is_overdue": loan.is_overdue(),
        "days_overdue": loan.days_overdue(),
    }


@router.post("/{loan_id}/return", response_model=LoanWithDetails)
def return_book(
    loan_id: int,
    library_service: LibraryService = Depends(get_library_service),
    session: Session = Depends(get_session)
) -> dict:
    """
    Return a borrowed book.
    
    Args:
        loan_id: Loan ID
        library_service: Library service instance
        session: Database session
    
    Returns:
        LoanWithDetails: Updated loan details
    
    Raises:
        HTTPException 404: If loan not found
        HTTPException 400: If book already returned
    """
    loan = library_service.return_book(loan_id)
    
    return {
        "id": loan.id,
        "book_id": loan.book_id,
        "member_id": loan.member_id,
        "checkout_date": loan.checkout_date,
        "due_date": loan.due_date,
        "return_date": loan.return_date,
        "renewal_count": loan.renewal_count,
        "created_at": loan.created_at,
        "updated_at": loan.updated_at,
        "book_title": loan.book.title if loan.book else None,
        "book_author": loan.book.author if loan.book else None,
        "member_name": loan.member.name if loan.member else None,
        "member_number": loan.member.member_number if loan.member else None,
        "is_overdue": loan.is_overdue(),
        "days_overdue": loan.days_overdue(),
    }


@router.post("/{loan_id}/renew", response_model=LoanRenewalResponse)
def renew_loan(
    loan_id: int,
    library_service: LibraryService = Depends(get_library_service),
) -> LoanRenewalResponse:
    """
    Renew a loan.
    
    Args:
        loan_id: Loan ID
        library_service: Library service instance
    
    Returns:
        LoanRenewalResponse: Renewal confirmation
    
    Raises:
        HTTPException 404: If loan not found
        HTTPException 400: If loan cannot be renewed
    """
    loan = library_service.renew_loan(loan_id)
    
    return LoanRenewalResponse(
        id=loan.id,
        new_due_date=loan.due_date,
        renewal_count=loan.renewal_count,
        message=f"Loan renewed successfully. New due date: {loan.due_date.strftime('%Y-%m-%d')}"
    )
