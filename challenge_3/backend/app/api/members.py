"""
Members API endpoints.

This module provides member management operations including
registration, updates, and loan history.
"""

from typing import Optional
from sqlmodel import Session, select, or_
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.database import get_session
from app.models.member import Member
from app.models.loan import Loan
from app.schemas.member import (
    MemberCreate,
    MemberUpdate,
    MemberResponse,
    MemberWithStats,
    MemberListResponse,
)
from app.schemas.loan import LoanWithDetails
from app.services.library_service import LibraryService
from app.api.deps import get_library_service
import math

router = APIRouter(prefix="/members", tags=["members"])


@router.post("/", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(
    member_data: MemberCreate,
    library_service: LibraryService = Depends(get_library_service),
    session: Session = Depends(get_session)
) -> Member:
    """
    Register a new library member.
    
    Args:
        member_data: Member registration data
        library_service: Library service instance
        session: Database session
    
    Returns:
        MemberResponse: Created member
    
    Raises:
        HTTPException 400: If email already exists
    """
    # Check if email already exists
    statement = select(Member).where(Member.email == member_data.email)
    existing_member = session.exec(statement).first()
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Member with email {member_data.email} already exists"
        )
    
    # Generate member number if not provided
    member_dict = member_data.model_dump()
    if not member_dict.get('member_number'):
        member_dict['member_number'] = library_service.generate_member_number()
    
    # Check if member number already exists
    statement = select(Member).where(Member.member_number == member_dict['member_number'])
    existing = session.exec(statement).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Member number {member_dict['member_number']} already exists"
        )
    
    member = Member(**member_dict)
    session.add(member)
    session.commit()
    session.refresh(member)
    
    return member


@router.get("/", response_model=MemberListResponse)
def get_members(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, email, or member number"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    session: Session = Depends(get_session)
) -> MemberListResponse:
    """
    Get a paginated list of members with optional filtering.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        search: Search term
        status_filter: Filter by membership status
        session: Database session
    
    Returns:
        MemberListResponse: Paginated member list
    """
    statement = select(Member)
    
    # Apply filters
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            or_(
                Member.name.ilike(search_pattern),  # type: ignore
                Member.email.ilike(search_pattern),  # type: ignore
                Member.member_number.ilike(search_pattern)  # type: ignore
            )
        )
    
    if status_filter:
        statement = statement.where(Member.status == status_filter)
    
    # Get total count
    total = len(list(session.exec(statement).all()))
    
    # Apply pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    members = session.exec(statement).all()
    
    return MemberListResponse(
        items=list(members),
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 0
    )


@router.get("/{member_id}", response_model=MemberWithStats)
def get_member(
    member_id: int,
    library_service: LibraryService = Depends(get_library_service),
    session: Session = Depends(get_session)
) -> dict:
    """
    Get a specific member by ID with statistics.
    
    Args:
        member_id: Member ID
        library_service: Library service instance
        session: Database session
    
    Returns:
        MemberWithStats: Member details with statistics
    
    Raises:
        HTTPException 404: If member not found
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    # Get statistics
    stats = library_service.get_member_statistics(member_id)
    
    # Convert to dict and add stats
    member_dict = {
        "id": member.id,
        "member_number": member.member_number,
        "name": member.name,
        "email": member.email,
        "phone": member.phone,
        "address": member.address,
        "membership_date": member.membership_date,
        "membership_expiry": member.membership_expiry,
        "status": member.status,
        "max_loans": member.max_loans,
        "created_at": member.created_at,
        "updated_at": member.updated_at,
        "active_loans_count": stats['active_loans_count'],
        "total_loans_count": stats['total_loans_count'],
        "has_overdue": stats['has_overdue'],
    }
    
    return member_dict


@router.put("/{member_id}", response_model=MemberResponse)
def update_member(
    member_id: int,
    member_data: MemberUpdate,
    session: Session = Depends(get_session)
) -> Member:
    """
    Update a member's information.
    
    Args:
        member_id: Member ID
        member_data: Updated member data
        session: Database session
    
    Returns:
        MemberResponse: Updated member
    
    Raises:
        HTTPException 404: If member not found
        HTTPException 400: If email already exists
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    # Update only provided fields
    update_data = member_data.model_dump(exclude_unset=True)
    
    # Check email uniqueness if being updated
    if 'email' in update_data and update_data['email'] != member.email:
        statement = select(Member).where(Member.email == update_data['email'])
        existing = session.exec(statement).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {update_data['email']} is already in use"
            )
    
    for key, value in update_data.items():
        setattr(member, key, value)
    
    session.commit()
    session.refresh(member)
    
    return member


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(
    member_id: int,
    session: Session = Depends(get_session)
) -> None:
    """
    Delete a member from the system.
    
    Args:
        member_id: Member ID
        session: Database session
    
    Raises:
        HTTPException 404: If member not found
        HTTPException 400: If member has active loans
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    # Check for active loans
    active_loans = [loan for loan in member.loans if loan.return_date is None]
    if active_loans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete member: {len(active_loans)} active loan(s) exist"
        )
    
    session.delete(member)
    session.commit()


@router.get("/{member_id}/loans", response_model=list[LoanWithDetails])
def get_member_loans(
    member_id: int,
    active_only: bool = Query(False, description="Show only active loans"),
    session: Session = Depends(get_session)
) -> list[dict]:
    """
    Get a member's loan history.
    
    Args:
        member_id: Member ID
        active_only: Only return active loans
        session: Database session
    
    Returns:
        list[LoanWithDetails]: List of loans with details
    
    Raises:
        HTTPException 404: If member not found
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    loans = member.loans
    
    if active_only:
        loans = [loan for loan in loans if loan.return_date is None]
    
    # Build detailed response
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
            "member_name": member.name,
            "member_number": member.member_number,
            "is_overdue": loan.is_overdue(),
            "days_overdue": loan.days_overdue(),
        }
        result.append(loan_dict)
    
    return result


@router.post("/{member_id}/renew", response_model=MemberResponse)
def renew_membership(
    member_id: int,
    months: int = Query(12, ge=1, le=36, description="Months to extend"),
    session: Session = Depends(get_session)
) -> Member:
    """
    Renew a member's membership.
    
    Args:
        member_id: Member ID
        months: Number of months to extend
        session: Database session
    
    Returns:
        MemberResponse: Updated member
    
    Raises:
        HTTPException 404: If member not found
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    member.renew_membership(months)
    session.commit()
    session.refresh(member)
    
    return member


@router.post("/{member_id}/suspend", response_model=MemberResponse)
def suspend_member(
    member_id: int,
    session: Session = Depends(get_session)
) -> Member:
    """
    Suspend a member's account.
    
    Args:
        member_id: Member ID
        session: Database session
    
    Returns:
        MemberResponse: Updated member
    
    Raises:
        HTTPException 404: If member not found
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    member.suspend()
    session.commit()
    session.refresh(member)
    
    return member


@router.post("/{member_id}/activate", response_model=MemberResponse)
def activate_member(
    member_id: int,
    session: Session = Depends(get_session)
) -> Member:
    """
    Activate a member's account.
    
    Args:
        member_id: Member ID
        session: Database session
    
    Returns:
        MemberResponse: Updated member
    
    Raises:
        HTTPException 404: If member not found
    """
    member = session.get(Member, member_id)
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    member.activate()
    session.commit()
    session.refresh(member)
    
    return member
