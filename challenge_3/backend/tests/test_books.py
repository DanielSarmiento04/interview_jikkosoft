"""
Tests for book API endpoints.
"""

from fastapi.testclient import TestClient
from sqlmodel import Session


def test_create_book(client: TestClient):
    """Test creating a new book."""
    response = client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "total_copies": 5,
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Clean Code"
    assert data["author"] == "Robert C. Martin"
    assert data["total_copies"] == 5
    assert data["available_copies"] == 5


def test_get_books(client: TestClient):
    """Test getting list of books."""
    # Create a book first
    client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "total_copies": 3,
        }
    )
    
    response = client.get("/api/v1/books")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1


def test_get_book_by_id(client: TestClient):
    """Test getting a specific book by ID."""
    # Create a book
    create_response = client.post(
        "/api/v1/books",
        json={
            "isbn": "9780201633610",
            "title": "Design Patterns",
            "author": "Gang of Four",
            "category": "Software Engineering",
            "total_copies": 2,
        }
    )
    book_id = create_response.json()["id"]
    
    # Get the book
    response = client.get(f"/api/v1/books/{book_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Design Patterns"


def test_update_book(client: TestClient):
    """Test updating a book."""
    # Create a book
    create_response = client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "total_copies": 3,
        }
    )
    book_id = create_response.json()["id"]
    
    # Update the book
    response = client.put(
        f"/api/v1/books/{book_id}",
        json={"total_copies": 10, "available_copies": 8}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_copies"] == 10
    assert data["available_copies"] == 8


def test_duplicate_isbn(client: TestClient):
    """Test that duplicate ISBN is rejected."""
    # Create first book
    client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "total_copies": 3,
        }
    )
    
    # Try to create duplicate
    response = client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Another Book",
            "author": "Another Author",
            "category": "Programming",
            "total_copies": 1,
        }
    )
    assert response.status_code == 400


def test_search_books(client: TestClient):
    """Test searching books."""
    # Create books
    client.post(
        "/api/v1/books",
        json={
            "isbn": "9780132350884",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "total_copies": 3,
        }
    )
    
    # Search
    response = client.get("/api/v1/books?search=Clean")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert "Clean" in data["items"][0]["title"]
