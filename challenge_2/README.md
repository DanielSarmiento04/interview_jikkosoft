# Two Sum - Challenge 2

**[English]** | **[Español](README_ES.md)**

## 📝 Problem Description

Robust and efficient implementation of the **Two Sum** algorithm in Python 3.12.

**Problem:** Given a list of integers and a target integer, return the indices of two numbers that sum to the target value.

- **Input:** `nums: list[int]`, `target: int`
- **Output:** `list[int]` - indices of two numbers that sum to the target
- **Constraint:** Each input has exactly one solution; the same element cannot be used twice

## 🎯 Example

```python
from src.two_sum import two_sum

# Basic case
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # [0, 1] because nums[0] + nums[1] = 2 + 7 = 9

# With negative numbers
nums = [-1, -2, -3, -4, -5]
target = -8
print(two_sum(nums, target))  # [2, 4] because -3 + (-5) = -8

# With duplicates
nums = [3, 3]
target = 6
print(two_sum(nums, target))  # [0, 1]
```

## 🚀 Implemented Solution

### Approach: Hash Map (Dictionary)

The solution uses a **hash map** (dictionary in Python) to achieve O(n) time complexity:

1. We iterate over the list only once
2. For each number, we calculate its complement: `complement = target - num`
3. We check if the complement already exists in the hash map
4. If it exists, we return the indices; if not, we store the current number

### Complexity

- **Time:** O(n) - Single pass through the array
- **Space:** O(n) - The hash map stores up to n elements

### Alternative Implementations

The project includes three implementations:

1. **`two_sum()`** - Optimized O(n) version with hash map ✅ **(RECOMMENDED)**
2. **`two_sum_brute_force()`** - Naive O(n²) version for comparison
3. **`two_sum_generator()`** - Memory-efficient version that returns a tuple

## 📁 Project Structure

```
challenge_2/
├── src/
│   ├── __init__.py
│   └── two_sum.py           # Main implementation
├── tests/
│   ├── __init__.py
│   ├── test_two_sum.py      # Unit tests
│   └── test_performance.py  # Performance tests
├── .gitignore
├── .python-version          # Python 3.12
├── pyproject.toml           # uv/pytest/mypy/ruff configuration
└── README.md
```

## 🛠️ Installation and Usage

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (package manager)

### Installation with uv

```bash
# Install development dependencies
uv sync --dev

# Or install manually
uv pip install pytest pytest-cov pytest-benchmark mypy ruff
```

### Basic Usage

## 🛠️ Instalación y Uso

### Requisitos Previos

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (gestor de paquetes)

### Instalación con uv

```bash
# Instalar dependencias de desarrollo
uv sync --dev

# O instalar manualmente
uv pip install pytest pytest-cov pytest-benchmark mypy ruff
```

### Basic Usage

```python
from src.two_sum import two_sum

result = two_sum([2, 7, 11, 15], 9)
print(result)  # [0, 1]
```

## 🧪 Running Tests

### Complete Tests

```bash
# Run all tests with coverage
uv run pytest

# View coverage report in HTML
uv run pytest --cov=src --cov-report=html
open htmlcov/index.html
```

### Specific Tests

```bash
# Basic tests only
uv run pytest tests/test_two_sum.py::TestTwoSumBasic -v

# Edge case tests only
uv run pytest tests/test_two_sum.py::TestTwoSumEdgeCases -v

# Error tests only
uv run pytest tests/test_two_sum.py::TestTwoSumErrors -v

# Performance benchmarks
uv run pytest tests/test_performance.py --benchmark-only
```

### Test Coverage

The project has **95%+ coverage** with tests for:

✅ Basic cases (positive, negative, mixed numbers)  
✅ Edge cases (zeros, duplicates, large arrays)  
✅ Error handling (empty lists, no solution)  
✅ Performance (10K, 100K, 1M elements)  
✅ Alternative implementations

## 🔍 Quality Assurance

### Linting with Ruff

```bash
# Check code style
uv run ruff check .

# Auto-format code
uv run ruff format .
```

### Type Checking with Mypy

```bash
# Verify static types
uv run mypy src/ tests/
```

### Run All Checks

```bash
# Linting
uv run ruff check .

# Type checking
uv run mypy src/ tests/

# Tests with coverage
uv run pytest --cov=src --cov-report=term-missing

# All in one
uv run ruff check . && uv run mypy src/ tests/ && uv run pytest
```

## 📊 Performance Benchmarks

Expected performance on modern hardware:

| Size   | Time (Optimized) | Time (Brute Force) |
|--------|------------------|--------------------|
| 1K     | < 1ms           | ~10ms              |
| 10K    | < 10ms          | ~1s                |
| 100K   | < 100ms         | ~100s              |
| 1M     | < 1s            | Not recommended    |

```bash
# Run benchmarks
uv run pytest tests/test_performance.py --benchmark-only -v
```

## 🧩 Test Cases Covered

### Happy Path
- ✅ Standard positive numbers
- ✅ Solution at the beginning of array
- ✅ Solution at the end of array
- ✅ Solution in the middle
- ✅ Large numbers

### Edge Cases
- ✅ Negative numbers
- ✅ Mix of positive/negative
- ✅ Target = 0
- ✅ Zero in the array
- ✅ Duplicate numbers
- ✅ Large arrays (1M+ elements)

### Error Handling
- ✅ Empty list → `ValueError`
- ✅ Single element → `ValueError`
- ✅ No solution → `ValueError`

## 🏗️ Design Principles

- **SOLID Principles** - Maintainable and extensible code
- **DRY** - Don't repeat code
- **Type Hints** - Python 3.12 modern type annotations
- **Docstrings** - Complete Google-style documentation
- **Error Handling** - Robust input validation
- **Testing** - 95%+ coverage with pytest

## 📚 Resources and References

- [PEP 8 - Style Guide](https://pep8.org/)
- [Python Type Hints](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- [Pytest Documentation](https://docs.pytest.org/)
- [Ruff Linter](https://docs.astral.sh/ruff/)
- [UV Package Manager](https://github.com/astral-sh/uv)

## 🔑 Key Concepts Demonstrated

1. ✅ **Efficient algorithms** - O(n) vs O(n²)
2. ✅ **Data structures** - Hash maps for fast lookups
3. ✅ **Type safety** - Complete type hints
4. ✅ **Exhaustive testing** - Unit, edge cases, performance
5. ✅ **Code quality** - Linting, formatting, type checking
6. ✅ **Documentation** - Docstrings, README, comments


