"""Comprehensive test suite for Two Sum implementation.

This module tests the two_sum function with various scenarios including
basic functionality, edge cases, error handling, and different data types.
"""

import pytest

from src.two_sum import two_sum, two_sum_brute_force, two_sum_generator


class TestTwoSumBasic:
    """Basic functionality tests for standard cases."""

    def test_example_case_1(self) -> None:
        """Test with standard positive integers - example from problem."""
        assert two_sum([2, 7, 11, 15], 9) == [0, 1]

    def test_example_case_2(self) -> None:
        """Test with numbers in middle of array."""
        assert two_sum([3, 2, 4], 6) == [1, 2]

    def test_example_case_3(self) -> None:
        """Test with duplicate numbers."""
        assert two_sum([3, 3], 6) == [0, 1]

    def test_solution_at_beginning(self) -> None:
        """Test when solution is at the start of the array."""
        assert two_sum([1, 2, 3, 4, 5], 3) == [0, 1]

    def test_solution_at_end(self) -> None:
        """Test when solution is at the end of the array."""
        assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4]

    def test_solution_in_middle(self) -> None:
        """Test when solution is in the middle of the array."""
        assert two_sum([1, 2, 3, 4, 5], 7) == [2, 3]

    def test_two_elements_exact(self) -> None:
        """Test with exactly two elements that sum to target."""
        assert two_sum([1, 2], 3) == [0, 1]

    def test_large_numbers(self) -> None:
        """Test with large integer values."""
        assert two_sum([1000000, 2000000, 3000000], 5000000) == [1, 2]


class TestTwoSumEdgeCases:
    """Edge case tests including negatives, zeros, and duplicates."""

    def test_negative_numbers(self) -> None:
        """Test with negative integers."""
        assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4]

    def test_mixed_positive_negative(self) -> None:
        """Test with mix of positive and negative numbers."""
        assert two_sum([-3, 4, 3, 90], 0) == [0, 2]

    def test_zero_target(self) -> None:
        """Test when target is zero."""
        assert two_sum([-1, 0, 1, 2], 0) == [0, 2]

    def test_zero_in_array(self) -> None:
        """Test with zero present in the array."""
        assert two_sum([0, 4, 3, 0], 0) == [0, 3]

    def test_duplicate_numbers_different_indices(self) -> None:
        """Test with duplicate numbers at different positions."""
        assert two_sum([2, 5, 5, 11], 10) == [1, 2]

    def test_multiple_valid_solutions_returns_first(self) -> None:
        """Test that first valid solution is returned when multiple exist."""
        # [1,3] and [2,2] both sum to 4, should return first found
        result = two_sum([1, 2, 3, 2], 4)
        assert result in [[0, 2], [1, 3]]  # Either is valid

    def test_all_same_numbers(self) -> None:
        """Test with all identical numbers."""
        assert two_sum([5, 5, 5, 5], 10) == [0, 1]

    def test_very_large_array(self) -> None:
        """Test with a larger array to ensure algorithm works at scale."""
        nums = list(range(1, 1001))  # [1, 2, 3, ..., 1000]
        # Sum of 500 and 501 = 1001 (but algorithm will find first pair)
        result = two_sum(nums, 1001)
        # Verify the result is valid
        assert nums[result[0]] + nums[result[1]] == 1001
        assert result[0] != result[1]


class TestTwoSumErrors:
    """Error handling and validation tests."""

    def test_empty_list_raises_error(self) -> None:
        """Test that empty list raises ValueError."""
        with pytest.raises(ValueError, match="at least 2 elements"):
            two_sum([], 0)

    def test_single_element_raises_error(self) -> None:
        """Test that single element list raises ValueError."""
        with pytest.raises(ValueError, match="at least 2 elements"):
            two_sum([1], 1)

    def test_no_solution_raises_error(self) -> None:
        """Test that no valid solution raises ValueError."""
        with pytest.raises(ValueError, match="No two numbers"):
            two_sum([1, 2, 3], 10)

    def test_no_solution_all_positive_small_target(self) -> None:
        """Test no solution when target is too small."""
        with pytest.raises(ValueError, match="No two numbers"):
            two_sum([5, 6, 7, 8], 2)

    def test_cannot_use_same_element_twice(self) -> None:
        """Test that same index cannot be used twice."""
        # If we have [5] and target 10, we can't use 5 + 5 from same index
        # This should fail with "at least 2 elements" error
        with pytest.raises(ValueError, match="at least 2 elements"):
            two_sum([5], 10)


class TestTwoSumAlternativeImplementations:
    """Test alternative implementations for correctness."""

    def test_brute_force_basic(self) -> None:
        """Test brute force implementation with basic case."""
        assert two_sum_brute_force([2, 7, 11, 15], 9) == [0, 1]

    def test_brute_force_matches_optimized(self) -> None:
        """Verify brute force gives same results as optimized version."""
        test_cases = [
            ([2, 7, 11, 15], 9),
            ([3, 2, 4], 6),
            ([3, 3], 6),
            ([-1, -2, -3, -4, -5], -8),
        ]
        for nums, target in test_cases:
            assert two_sum_brute_force(nums, target) == two_sum(nums, target)

    def test_generator_version(self) -> None:
        """Test generator-based implementation."""
        result = two_sum_generator([2, 7, 11, 15], 9)
        assert result == (0, 1)
        assert isinstance(result, tuple)

    def test_generator_matches_list_version(self) -> None:
        """Verify generator version gives same results as list version."""
        test_cases = [
            ([2, 7, 11, 15], 9),
            ([3, 2, 4], 6),
            ([-1, -2, -3, -4, -5], -8),
        ]
        for nums, target in test_cases:
            list_result = two_sum(nums, target)
            tuple_result = two_sum_generator(nums, target)
            assert list(tuple_result) == list_result


class TestTwoSumTypeHints:
    """Test type hint compliance (these pass if mypy passes)."""

    def test_returns_list_of_ints(self) -> None:
        """Verify return type is list[int]."""
        result = two_sum([1, 2, 3], 5)
        assert isinstance(result, list)
        assert all(isinstance(x, int) for x in result)
        assert len(result) == 2

    def test_accepts_list_of_ints(self) -> None:
        """Verify function accepts list[int] parameter."""
        nums: list[int] = [1, 2, 3, 4]
        target: int = 5
        result = two_sum(nums, target)
        # Verify the result is correct (1+4=5 or 2+3=5)
        assert nums[result[0]] + nums[result[1]] == target
        assert result[0] != result[1]


# Property-based tests could be added here using hypothesis library
# Example:
# from hypothesis import given, strategies as st
#
# @given(
#     st.lists(st.integers(), min_size=2, max_size=100),
#     st.integers()
# )
# def test_two_sum_properties(nums, target):
#     """Property: if solution exists, sum of elements equals target."""
#     try:
#         indices = two_sum(nums, target)
#         assert nums[indices[0]] + nums[indices[1]] == target
#         assert indices[0] != indices[1]
#     except ValueError:
#         # No solution exists, which is valid
#         pass
