#!/bin/bash
# Quick test script to verify the API is working

BASE_URL="http://localhost:8000"

echo "🧪 Testing Library Management System API"
echo "=========================================="
echo ""

# Check if server is running
echo "1️⃣  Checking if server is running..."
if curl -s "$BASE_URL/health" > /dev/null; then
    echo "✅ Server is running!"
else
    echo "❌ Server is not running. Start it with: source env.example.sh"
    exit 1
fi

echo ""
echo "2️⃣  Creating a test book..."
BOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780132350884",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Software Engineering",
    "total_copies": 5
  }')

BOOK_ID=$(echo $BOOK_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")

if [ -n "$BOOK_ID" ]; then
    echo "✅ Book created with ID: $BOOK_ID"
else
    echo "❌ Failed to create book"
    echo "Response: $BOOK_RESPONSE"
fi

echo ""
echo "3️⃣  Creating a test member..."
MEMBER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "max_loans": 3
  }')

MEMBER_ID=$(echo $MEMBER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")

if [ -n "$MEMBER_ID" ]; then
    echo "✅ Member created with ID: $MEMBER_ID"
    MEMBER_NUMBER=$(echo $MEMBER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('member_number', ''))")
    echo "   Member Number: $MEMBER_NUMBER"
else
    echo "❌ Failed to create member"
    echo "Response: $MEMBER_RESPONSE"
fi

echo ""
echo "4️⃣  Checking out the book..."
if [ -n "$BOOK_ID" ] && [ -n "$MEMBER_ID" ]; then
    LOAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/loans" \
      -H "Content-Type: application/json" \
      -d "{
        \"book_id\": $BOOK_ID,
        \"member_id\": $MEMBER_ID
      }")
    
    LOAN_ID=$(echo $LOAN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
    
    if [ -n "$LOAN_ID" ]; then
        echo "✅ Book checked out! Loan ID: $LOAN_ID"
    else
        echo "❌ Failed to checkout book"
        echo "Response: $LOAN_RESPONSE"
    fi
fi

echo ""
echo "5️⃣  Getting loan statistics..."
STATS=$(curl -s "$BASE_URL/api/v1/loans/statistics")
echo "📊 Statistics: $STATS"

echo ""
echo "6️⃣  Listing all books..."
BOOKS=$(curl -s "$BASE_URL/api/v1/books?page=1&page_size=5")
BOOK_COUNT=$(echo $BOOKS | python3 -c "import sys, json; print(json.load(sys.stdin).get('total', 0))")
echo "📚 Total books in library: $BOOK_COUNT"

echo ""
echo "=========================================="
echo "✅ All tests completed!"
echo ""
echo "📖 View API documentation at: $BASE_URL/docs"
echo "🔄 Interactive API docs at: $BASE_URL/redoc"
echo ""
