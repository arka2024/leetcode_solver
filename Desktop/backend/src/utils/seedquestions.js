import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import Question from '../models/questionmodels.js';

dotenv.config();

const sampleQuestions = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Find two numbers in an array that add up to a given target.",
    acceptance: "45.8%",
    submissions: 1234567
  },
  {
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Determine whether an integer is a palindrome.",
    acceptance: "53.2%",
    submissions: 765432
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: "Check if a string has valid opening and closing brackets.",
    acceptance: "41.3%",
    submissions: 543210
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    description: "Merge two sorted linked lists into one sorted list.",
    acceptance: "58.6%",
    submissions: 109238
  },
  {
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    description: "Remove duplicates in-place from a sorted array.",
    acceptance: "50.3%",
    submissions: 432198
  },
  {
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["String", "Trie"],
    description: "Find the longest common prefix among an array of strings.",
    acceptance: "40.1%",
    submissions: 321678
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description: "Maximize profit from a single buy/sell stock transaction.",
    acceptance: "53.4%",
    submissions: 732000
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming"],
    description: "Count distinct ways to climb to the top of stairs.",
    acceptance: "53.1%",
    submissions: 378222
  },
  {
    title: "Symmetric Tree",
    difficulty: "Easy",
    tags: ["Tree", "DFS", "BFS"],
    description: "Check if a binary tree is symmetric around its center.",
    acceptance: "52.7%",
    submissions: 289320
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    tags: ["Tree", "DFS"],
    description: "Find the maximum depth of a binary tree.",
    acceptance: "71.5%",
    submissions: 645321
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    description: "Add two numbers represented as linked lists.",
    acceptance: "37.8%",
    submissions: 954321
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: "Find the longest substring without repeating characters.",
    acceptance: "33.4%",
    submissions: 989876
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: "Find all triplets in an array that sum up to zero.",
    acceptance: "31.6%",
    submissions: 654231
  },
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    description: "Return all letter combinations a phone number could represent.",
    acceptance: "50.2%",
    submissions: 321111
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["Backtracking"],
    description: "Generate all combinations of well-formed parentheses.",
    acceptance: "65.4%",
    submissions: 423456
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description: "Find two lines that together with x-axis form a container.",
    acceptance: "52.8%",
    submissions: 443211
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["Hash Table", "String"],
    description: "Group anagrams together from a string array.",
    acceptance: "60.1%",
    submissions: 345765
  },
  {
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    tags: ["Array", "Matrix"],
    description: "Set entire row and column to 0 if a cell is 0.",
    acceptance: "54.6%",
    submissions: 221232
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Array"],
    description: "Search for a target value in a rotated sorted array.",
    acceptance: "39.8%",
    submissions: 184212
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description: "Find the median of two sorted arrays.",
    acceptance: "29.7%",
    submissions: 654321
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    description: "Merge k sorted linked lists and return as one sorted list.",
    acceptance: "45.1%",
    submissions: 321000
  },
  {
    title: "First Missing Positive",
    difficulty: "Hard",
    tags: ["Array"],
    description: "Find the smallest missing positive integer.",
    acceptance: "35.7%",
    submissions: 432143
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack"],
    description: "Compute how much water can be trapped after raining.",
    acceptance: "54.6%",
    submissions: 411234
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    tags: ["Backtracking"],
    description: "Solve the N-Queens problem and return all distinct solutions.",
    acceptance: "58.1%",
    submissions: 167890
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["BFS", "Hash Table"],
    description: "Find shortest transformation sequence from beginWord to endWord.",
    acceptance: "33.2%",
    submissions: 197654
  }
];

const seedQuestions = async () => {
  try {
    await connectDB();
    await Question.deleteMany(); // optional: clear existing
    await Question.insertMany(sampleQuestions);
    console.log("✅ 25 Questions Inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedQuestions();
