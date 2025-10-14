"""Demo script for Two Sum implementation."""

from src.two_sum import (
    two_sum,
    two_sum_brute_force,
    two_sum_generator
)


def main() -> None:
    """Run examples demonstrating the Two Sum function."""
    print("=" * 60)
    print("TWO SUM - Challenge 2")
    print("=" * 60)

    # Example 1: Basic case
    print("\n📌 Example 1: Basic case")
    nums1 = [2, 7, 11, 15]
    target1 = 9
    result1 = two_sum(nums1, target1)
    print(f"Input: nums = {nums1}, target = {target1}")
    print(f"Output: {result1}")
    print(
        f"Explanation: nums[{result1[0]}] + nums[{result1[1]}] = "
        f"{nums1[result1[0]]} + {nums1[result1[1]]} = {target1}"
    )

    # Example 2: Negative numbers
    print("\n📌 Example 2: Negative numbers")
    nums2 = [-1, -2, -3, -4, -5]
    target2 = -8
    result2 = two_sum(nums2, target2)
    print(f"Input: nums = {nums2}, target = {target2}")
    print(f"Output: {result2}")
    print(
        f"Explanation: nums[{result2[0]}] + nums[{result2[1]}] = "
        f"{nums2[result2[0]]} + {nums2[result2[1]]} = {target2}"
    )

    # Example 3: Duplicates
    print("\n📌 Example 3: Duplicate numbers")
    nums3 = [3, 3]
    target3 = 6
    result3 = two_sum(nums3, target3)
    print(f"Input: nums = {nums3}, target = {target3}")
    print(f"Output: {result3}")
    print(
        f"Explanation: nums[{result3[0]}] + nums[{result3[1]}] = "
        f"{nums3[result3[0]]} + {nums3[result3[1]]} = {target3}"
    )

    # Example 4: Zero in array
    print("\n📌 Example 4: Zero in array")
    nums4 = [0, 4, 3, 0]
    target4 = 0
    result4 = two_sum(nums4, target4)
    print(f"Input: nums = {nums4}, target = {target4}")
    print(f"Output: {result4}")
    print(
        f"Explanation: nums[{result4[0]}] + nums[{result4[1]}] = "
        f"{nums4[result4[0]]} + {nums4[result4[1]]} = {target4}"
    )

    # Example 5: Error case
    print("\n📌 Example 5: Error handling - No solution")
    nums5 = [1, 2, 3]
    target5 = 10
    try:
        result5 = two_sum(nums5, target5)
        print(f"Output: {result5}")
    except ValueError as e:
        print(f"Input: nums = {nums5}, target = {target5}")
        print(f"Error: {e}")

    print("\n" + "=" * 60)
    print("✅ All examples completed successfully!")
    print("=" * 60)
    print("\n💡 Run tests with: uv run pytest")
    print("📊 See coverage with: uv run pytest --cov=src --cov-report=html")
    print("🔍 Check types with: uv run mypy src/ tests/")
    print("🎨 Lint code with: uv run ruff check .")


if __name__ == "__main__":
    main()

