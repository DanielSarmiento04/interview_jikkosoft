"""Two Sum algorithm implementation using hash map approach.

This module provides an efficient O(n) solution to the Two Sum problem.
"""


def two_sum(nums: list[int], target: int) -> list[int]:
    """Find indices of two numbers that sum to target.

    This function uses a hash map (dictionary) approach to solve the problem
    in a single pass with O(n) time complexity. For each element, it checks
    if the complement (target - current_number) exists in the hash map.

    Args:
        nums: List of integers to search. Must contain at least 2 elements.
        target: Target sum to find.

    Returns:
        List containing two indices [i, j] where nums[i] + nums[j] == target.
        The indices are returned in the order they are found (i < j).

    Raises:
        ValueError: If nums has fewer than 2 elements.
        ValueError: If no solution exists.

    Time Complexity: O(n) - Single pass through the array
    Space Complexity: O(n) - Hash map stores up to n elements

    Examples:
        >>> two_sum([2, 7, 11, 15], 9)
        [0, 1]
        >>> two_sum([3, 2, 4], 6)
        [1, 2]
        >>> two_sum([3, 3], 6)
        [0, 1]
        >>> two_sum([-1, -2, -3, -4, -5], -8)
        [2, 4]
    """
    # Validate input: need at least 2 elements to form a pair
    if len(nums) < 2:
        raise ValueError(
            f"Input list must contain at least 2 elements, got {len(nums)}"
        )

    # Hash map to store number -> index mapping
    # Key: number we've seen, Value: its index
    seen: dict[int, int] = {}

    # Single pass through the array
    for i, num in enumerate(nums):
        # Calculate the complement needed to reach target
        complement = target - num

        # Check if we've already seen the complement
        if complement in seen:
            # Found the pair! Return indices [first_index, current_index]
            return [seen[complement], i]

        # Store current number and its index for future lookups
        # Note: This handles duplicates correctly - we store the latest index
        seen[num] = i

    # No solution found after checking all elements
    raise ValueError(f"No two numbers in the list sum to {target}")


def two_sum_brute_force(nums: list[int], target: int) -> list[int]:
    """Alternative brute force implementation for comparison.

    This is a naive O(n²) solution using nested loops. Provided for
    educational purposes and performance comparison.

    Args:
        nums: List of integers to search.
        target: Target sum to find.

    Returns:
        List containing two indices [i, j] where nums[i] + nums[j] == target.

    Raises:
        ValueError: If nums has fewer than 2 elements.
        ValueError: If no solution exists.

    Time Complexity: O(n²) - Nested loops
    Space Complexity: O(1) - No additional data structures
    """
    if len(nums) < 2:
        raise ValueError(
            f"Input list must contain at least 2 elements, got {len(nums)}"
        )

    # Check every pair of elements
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

    raise ValueError(f"No two numbers in the list sum to {target}")


def two_sum_generator(nums: list[int], target: int) -> tuple[int, int]:
    """Memory-efficient generator-based implementation.

    Returns a tuple instead of list for slightly better memory efficiency.
    Useful when working with very large datasets where memory is constrained.

    Args:
        nums: List of integers to search.
        target: Target sum to find.

    Returns:
        Tuple containing two indices (i, j) where nums[i] + nums[j] == target.

    Raises:
        ValueError: If nums has fewer than 2 elements.
        ValueError: If no solution exists.

    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if len(nums) < 2:
        raise ValueError(
            f"Input list must contain at least 2 elements, got {len(nums)}"
        )

    seen: dict[int, int] = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return (seen[complement], i)
        seen[num] = i

    raise ValueError(f"No two numbers in the list sum to {target}")
