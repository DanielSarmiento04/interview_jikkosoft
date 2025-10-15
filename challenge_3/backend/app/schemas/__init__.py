"""
Schemas package initialization.
"""

from app.schemas.book import (
    BookBase,
    BookCreate,
    BookUpdate,
    BookResponse,
    BookListResponse,
)
from app.schemas.member import (
    MemberBase,
    MemberCreate,
    MemberUpdate,
    MemberResponse,
    MemberWithStats,
    MemberListResponse,
)
from app.schemas.loan import (
    LoanBase,
    LoanCreate,
    LoanResponse,
    LoanWithDetails,
    LoanReturnRequest,
    LoanRenewalResponse,
    LoanListResponse,
    LoanStatistics,
)

__all__ = [
    # Book schemas
    "BookBase",
    "BookCreate",
    "BookUpdate",
    "BookResponse",
    "BookListResponse",
    # Member schemas
    "MemberBase",
    "MemberCreate",
    "MemberUpdate",
    "MemberResponse",
    "MemberWithStats",
    "MemberListResponse",
    # Loan schemas
    "LoanBase",
    "LoanCreate",
    "LoanResponse",
    "LoanWithDetails",
    "LoanReturnRequest",
    "LoanRenewalResponse",
    "LoanListResponse",
    "LoanStatistics",
]
