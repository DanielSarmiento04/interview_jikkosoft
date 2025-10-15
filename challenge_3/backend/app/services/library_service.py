"""
Library service layer containing business logic for library operations.

This service handles complex operations that involve multiple models
and enforces business rules.
"""

from typing import Optional
from datetime import datetime, timedelta
from sqlmodel import Session, select
from fastapi import HTTPException, status

from app.models.book import Book
from app.models.member import Member, MembershipStatus
from app.models.loan import Loan


class LibraryService:
    """Service for managing library operations"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def checkout_book(
        self, 
        book_id: int, 
        member_id: int,
        due_date: Optional[datetime] = None
    ) -> Loan:
        """
        Checkout a book to a member.
        
        Args:
            book_id: ID of the book to checkout
            member_id: ID of the member checking out the book
            due_date: Optional custom due date
        
        Returns:
            Loan: The created loan object
        
        Raises:
            HTTPException: If checkout cannot be completed
        """
        # Get book
        book = self.session.get(Book, book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book with id {book_id} not found"
            )
        
        # Get member
        member = self.session.get(Member, member_id)
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Member with id {member_id} not found"
            )
        
        # Validate member can borrow
        if not member.can_borrow():
            reasons = []
            if member.status != MembershipStatus.ACTIVE:
                reasons.append(f"membership is {member.status.value}")
            if member.membership_expiry and member.membership_expiry < datetime.utcnow():
                reasons.append("membership has expired")
            if member.get_active_loans_count() >= member.max_loans:
                reasons.append(f"maximum loans ({member.max_loans}) reached")
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Member cannot borrow: {', '.join(reasons)}"
            )
        
        # Check for overdue books
        if member.has_overdue_books():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Member has overdue books and cannot checkout new books"
            )
        
        # Check book availability
        if not book.is_available():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No copies of '{book.title}' are currently available"
            )
        
        # Create loan
        loan = Loan(
            book_id=book_id,
            member_id=member_id,
            due_date=due_date or (datetime.utcnow() + timedelta(days=Loan.DEFAULT_LOAN_DAYS))
        )
        
        # Update book availability
        try:
            book.checkout()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        self.session.add(loan)
        self.session.commit()
        self.session.refresh(loan)
        
        return loan
    
    def return_book(self, loan_id: int) -> Loan:
        """
        Process a book return.
        
        Args:
            loan_id: ID of the loan to return
        
        Returns:
            Loan: The updated loan object
        
        Raises:
            HTTPException: If return cannot be processed
        """
        # Get loan with relationships
        loan = self.session.get(Loan, loan_id)
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Loan with id {loan_id} not found"
            )
        
        # Get book
        book = self.session.get(Book, loan.book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated book not found"
            )
        
        # Mark as returned
        try:
            loan.return_book()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        # Update book availability
        try:
            book.return_book()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        self.session.commit()
        self.session.refresh(loan)
        
        return loan
    
    def renew_loan(self, loan_id: int) -> Loan:
        """
        Renew a loan.
        
        Args:
            loan_id: ID of the loan to renew
        
        Returns:
            Loan: The updated loan object
        
        Raises:
            HTTPException: If renewal cannot be processed
        """
        loan = self.session.get(Loan, loan_id)
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Loan with id {loan_id} not found"
            )
        
        try:
            loan.renew()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        self.session.commit()
        self.session.refresh(loan)
        
        return loan
    
    def get_overdue_loans(self) -> list[Loan]:
        """
        Get all overdue loans.
        
        Returns:
            list[Loan]: List of overdue loans
        """
        statement = select(Loan).where(
            Loan.return_date.is_(None),
            Loan.due_date < datetime.utcnow()
        )
        return list(self.session.exec(statement).all())
    
    def generate_member_number(self) -> str:
        """
        Generate a unique member number.
        
        Returns:
            str: Generated member number in format MEM{year}{sequential}
        """
        year = datetime.utcnow().year
        prefix = f"MEM{year}"
        
        # Get the last member number for this year
        statement = select(Member).where(
            Member.member_number.startswith(prefix)  # type: ignore
        ).order_by(Member.member_number.desc())
        
        last_member = self.session.exec(statement).first()
        
        if last_member:
            # Extract sequence number and increment
            try:
                seq = int(last_member.member_number[len(prefix):]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        
        return f"{prefix}{seq:04d}"
    
    def get_member_statistics(self, member_id: int) -> dict:
        """
        Get statistics for a member.
        
        Args:
            member_id: ID of the member
        
        Returns:
            dict: Dictionary with member statistics
        
        Raises:
            HTTPException: If member not found
        """
        member = self.session.get(Member, member_id)
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Member with id {member_id} not found"
            )
        
        active_loans = sum(1 for loan in member.loans if loan.return_date is None)
        total_loans = len(member.loans)
        overdue_loans = sum(1 for loan in member.loans if loan.is_overdue())
        
        return {
            "member_id": member_id,
            "active_loans_count": active_loans,
            "total_loans_count": total_loans,
            "overdue_loans_count": overdue_loans,
            "has_overdue": member.has_overdue_books(),
            "can_borrow": member.can_borrow(),
        }
