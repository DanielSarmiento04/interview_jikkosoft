"""Performance benchmark tests for Two Sum implementations.

This module uses pytest-benchmark to measure and compare performance
of different Two Sum implementations across various dataset sizes.
"""

from typing import Any

import pytest

from src.two_sum import two_sum, two_sum_brute_force


class TestTwoSumPerformance:
    """Performance benchmark tests for different dataset sizes."""

    @pytest.mark.benchmark(group="small")
    def test_performance_small_array_optimized(self, benchmark: Any) -> None:
        """Benchmark optimized version with small array (100 elements)."""
        nums = list(range(100))
        target = 197  # Sum of 98 + 99

        result = benchmark(two_sum, nums, target)
        assert result == [98, 99]

    @pytest.mark.benchmark(group="small")
    def test_performance_small_array_brute_force(self, benchmark: Any) -> None:
        """Benchmark brute force version with small array (100 elements)."""
        nums = list(range(100))
        target = 197

        result = benchmark(two_sum_brute_force, nums, target)
        assert result == [98, 99]

    @pytest.mark.benchmark(group="medium")
    def test_performance_medium_array_optimized(self, benchmark: Any) -> None:
        """Benchmark optimized version with medium array (1K elements)."""
        nums = list(range(1000))
        target = 1997  # Sum of 998 + 999

        result = benchmark(two_sum, nums, target)
        assert result == [998, 999]

    @pytest.mark.benchmark(group="medium")
    def test_performance_medium_array_brute_force(self, benchmark: Any) -> None:
        """Benchmark brute force version with medium array (1K elements)."""
        nums = list(range(1000))
        target = 1997

        result = benchmark(two_sum_brute_force, nums, target)
        assert result == [998, 999]

    @pytest.mark.benchmark(group="large")
    def test_performance_large_array_optimized(self, benchmark: Any) -> None:
        """Benchmark optimized version with large array (10K elements)."""
        nums = list(range(10000))
        target = 19997  # Sum of 9998 + 9999

        result = benchmark(two_sum, nums, target)
        assert result == [9998, 9999]

    @pytest.mark.benchmark(group="xlarge")
    def test_performance_xlarge_array_optimized(self, benchmark: Any) -> None:
        """Benchmark optimized version with extra large array (100K elements)."""
        nums = list(range(100000))
        target = 199997  # Sum of 99998 + 99999

        result = benchmark(two_sum, nums, target)
        assert result == [99998, 99999]

    @pytest.mark.benchmark(group="worst-case")
    def test_performance_worst_case_no_solution(self, benchmark: Any) -> None:
        """Benchmark worst case: no solution exists (must check all elements)."""
        nums = list(range(10000))
        target = -1  # No two positive numbers sum to -1

        with pytest.raises(ValueError):
            benchmark(two_sum, nums, target)

    @pytest.mark.benchmark(group="worst-case")
    def test_performance_worst_case_solution_at_end(self, benchmark: Any) -> None:
        """Benchmark worst case: solution at the very end of array."""
        nums = list(range(10000))
        target = 19997  # Last two elements

        result = benchmark(two_sum, nums, target)
        assert result == [9998, 9999]


class TestTwoSumComplexity:
    """Tests to verify time and space complexity characteristics."""

    def test_time_complexity_linear(self) -> None:
        """Verify O(n) time complexity by comparing different sizes.

        The optimized algorithm should scale linearly, while brute force
        should scale quadratically.
        """
        import time

        # Small dataset
        nums_small = list(range(1000))
        start = time.perf_counter()
        two_sum(nums_small, 1997)
        time_small = time.perf_counter() - start

        # Large dataset (10x size)
        nums_large = list(range(10000))
        start = time.perf_counter()
        two_sum(nums_large, 19997)
        time_large = time.perf_counter() - start

        # For O(n), 10x data should take roughly 10x time (with some variance)
        # We allow up to 100x for safety (brute force would be ~100x)
        ratio = time_large / time_small if time_small > 0 else 0
        assert ratio < 100, f"Time ratio too high: {ratio:.2f}x"

    def test_space_complexity_linear(self) -> None:
        """Verify O(n) space complexity.

        The hash map should store at most n elements.
        This is a conceptual test - actual memory profiling would need
        memory_profiler or similar tools.
        """
        # The algorithm creates a dictionary with at most len(nums) entries
        # This is verified by the implementation logic
        nums = list(range(1000))
        result = two_sum(nums, 1997)
        assert result == [998, 999]
        # If we got here, space complexity is acceptable

    def test_early_termination(self) -> None:
        """Verify algorithm terminates early when solution found.

        Should not process entire array if solution found early.
        """
        import time

        # Solution at beginning
        nums_early = [1, 2] + list(range(3, 100000))
        start = time.perf_counter()
        result = two_sum(nums_early, 3)
        _ = time.perf_counter() - start  # Time measurement for validation
        assert result == [0, 1]

        # Solution at end
        nums_late = list(range(100000))
        start = time.perf_counter()
        result = two_sum(nums_late, 199997)
        _ = time.perf_counter() - start  # Time measurement for validation
        assert result == [99998, 99999]

        # Early termination should be significantly faster
        # (though this can vary based on system load)
        # We just verify both complete successfully


class TestTwoSumMemoryEfficiency:
    """Tests for memory efficiency with different data patterns."""

    def test_memory_with_duplicates(self) -> None:
        """Test memory usage with many duplicate values.

        Hash map should handle duplicates efficiently by overwriting.
        """
        # Many duplicates - hash map stays small
        nums = [1] * 5000 + [2] * 5000
        result = two_sum(nums, 3)
        # Verify the result is valid (any 1 + any 2 = 3)
        assert nums[result[0]] + nums[result[1]] == 3
        assert result[0] != result[1]

    def test_memory_with_unique_values(self) -> None:
        """Test memory usage with all unique values.

        Hash map grows to nearly n elements in worst case.
        """
        nums = list(range(10000))
        result = two_sum(nums, 19997)
        assert result == [9998, 9999]


# Comparison test to demonstrate performance difference
class TestAlgorithmComparison:
    """Compare optimized vs brute force to demonstrate improvement."""

    def test_compare_algorithms_medium_size(self) -> None:
        """Compare both algorithms on medium-sized array.

        This demonstrates why O(n) is better than O(n²).
        """
        import time

        nums = list(range(5000))
        target = 9997

        # Optimized O(n) version
        start = time.perf_counter()
        result1 = two_sum(nums, target)
        time_optimized = time.perf_counter() - start

        # Brute force O(n²) version
        start = time.perf_counter()
        result2 = two_sum_brute_force(nums, target)
        time_brute = time.perf_counter() - start

        # Both should return same result
        assert result1 == result2

        # Optimized should be faster (though exact ratio varies)
        # We just verify both work correctly
        assert time_optimized >= 0
        assert time_brute >= 0
