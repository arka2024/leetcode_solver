const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Problem = require('../models/Problem');

// Sample problems data
const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `<h2>Problem</h2>
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p>
    <p>You can return the answer in any order.</p>`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Hash Table", "Two Pointers"],
    constraints: {
      timeLimit: 2000,
      memoryLimit: 256,
      languages: ["cpp", "python", "java", "javascript"]
    },
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        isHidden: false,
        points: 1
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        isHidden: false,
        points: 1
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
        isHidden: true,
        points: 1
      }
    ],
    examples: [
      {
        input: "[2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "[3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    hints: [
      "Use a hash map to store numbers and their indices as you iterate through the array.",
      "For each number, check if target - current number exists in the hash map."
    ]
  },
  {
    title: "Reverse Integer",
    slug: "reverse-integer",
    description: `<h2>Problem</h2>
    <p>Given a signed 32-bit integer <code>x</code>, return <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-2^31, 2^31 - 1]</code>, then return <code>0</code>.</p>
    <p><strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong></p>`,
    difficulty: "Medium",
    category: "Math",
    tags: ["Math"],
    constraints: {
      timeLimit: 1000,
      memoryLimit: 128,
      languages: ["cpp", "python", "java", "javascript"]
    },
    testCases: [
      {
        input: "123",
        expectedOutput: "321",
        isHidden: false,
        points: 1
      },
      {
        input: "-123",
        expectedOutput: "-321",
        isHidden: false,
        points: 1
      },
      {
        input: "120",
        expectedOutput: "21",
        isHidden: false,
        points: 1
      },
      {
        input: "1534236469",
        expectedOutput: "0",
        isHidden: true,
        points: 2
      }
    ],
    examples: [
      {
        input: "x = 123",
        output: "321"
      },
      {
        input: "x = -123",
        output: "-321"
      },
      {
        input: "x = 120",
        output: "21"
      }
    ],
    hints: [
      "Check for integer overflow before returning the result.",
      "Handle negative numbers properly."
    ]
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    description: `<h2>Problem</h2>
    <p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is palindrome integer.</p>
    <p>An integer is a <strong>palindrome</strong> when it reads the same backward as forward.</p>
    <ul>
      <li>For example, <code>121</code> is a palindrome while <code>123</code> is not.</li>
    </ul>`,
    difficulty: "Easy",
    category: "Math",
    tags: ["Math"],
    constraints: {
      timeLimit: 1000,
      memoryLimit: 128,
      languages: ["cpp", "python", "java", "javascript"]
    },
    testCases: [
      {
        input: "121",
        expectedOutput: "true",
        isHidden: false,
        points: 1
      },
      {
        input: "-121",
        expectedOutput: "false",
        isHidden: false,
        points: 1
      },
      {
        input: "10",
        expectedOutput: "false",
        isHidden: false,
        points: 1
      }
    ],
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    hints: [
      "Negative numbers are not palindromes.",
      "You can reverse the number and compare with original, or reverse only half of it."
    ]
  },
  {
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    description: `<h2>Problem</h2>
    <p>Given two strings <code>text1</code> and <code>text2</code>, return <em>the length of their longest common subsequence</em>. If there is no common subsequence, return <code>0</code>.</p>
    <p>A <strong>subsequence</strong> of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p>
    <ul>
      <li>For example, <code>"ace"</code> is a subsequence of <code>"abcde"</code>.</li>
    </ul>
    <p>A <strong>common subsequence</strong> of two strings is a subsequence that is common to both strings.</p>`,
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["String", "Dynamic Programming"],
    constraints: {
      timeLimit: 3000,
      memoryLimit: 512,
      languages: ["cpp", "python", "java", "javascript"]
    },
    testCases: [
      {
        input: "abcde\nace",
        expectedOutput: "3",
        isHidden: false,
        points: 2
      },
      {
        input: "abc\nabc",
        expectedOutput: "3",
        isHidden: false,
        points: 1
      },
      {
        input: "abc\ndef",
        expectedOutput: "0",
        isHidden: false,
        points: 1
      }
    ],
    examples: [
      {
        input: 'text1 = "abcde", text2 = "ace"',
        output: "3",
        explanation: "The longest common subsequence is \"ace\" and its length is 3."
      },
      {
        input: 'text1 = "abc", text2 = "abc"',
        output: "3",
        explanation: "The longest common subsequence is \"abc\" and its length is 3."
      }
    ],
    hints: [
      "Use dynamic programming with a 2D table.",
      "If characters match, add 1 to the diagonal value, otherwise take max of left and top."
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinejudge');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@codejudge.com',
      password: adminPassword,
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator'
      }
    });
    await admin.save();
    console.log('Created admin user');

    // Create demo user
    const demoPassword = await bcrypt.hash('demo123', 10);
    const demoUser = new User({
      username: 'demo',
      email: 'demo@codejudge.com',
      password: demoPassword,
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        institution: 'CodeJudge University',
        country: 'USA'
      },
      stats: {
        problemsSolved: 2,
        totalSubmissions: 5,
        acceptedSubmissions: 3,
        rating: 1350
      }
    });
    await demoUser.save();
    console.log('Created demo user');

    // Create sample problems
    for (const problemData of sampleProblems) {
      const problem = new Problem({
        ...problemData,
        author: admin._id
      });
      await problem.save();
      console.log(`Created problem: ${problem.title}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin - Username: admin, Password: admin123');
    console.log('Demo User - Username: demo, Password: demo123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();