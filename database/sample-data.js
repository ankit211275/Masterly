// Sample Data for Educational Platform

// Import ObjectId from MongoDB
const { ObjectId } = require("mongodb")

// Declare db variable
let db

// Sample Users
const sampleUsers = [
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    email: "alex.johnson@example.com",
    password: "$2b$10$hashedpassword", // bcrypt hashed
    profile: {
      firstName: "Alex",
      lastName: "Johnson",
      displayName: "Alex Johnson",
      avatar: "https://example.com/avatars/alex.jpg",
      bio: "Passionate software developer with 3+ years of experience. Currently focusing on mastering data structures, algorithms, and system design.",
      location: "San Francisco, CA",
      timezone: "PST",
      language: "en",
      socialLinks: {
        github: "alexjohnson",
        linkedin: "alex-johnson-dev",
        website: "https://alexjohnson.dev",
      },
    },
    subscription: {
      plan: "premium",
      status: "active",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2025-01-15"),
      autoRenew: true,
      billingCycle: "yearly",
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        courseReminders: true,
        achievements: true,
        weeklyReports: true,
      },
      learning: {
        difficultyPreference: "adaptive",
        dailyGoal: 60,
        preferredLanguages: ["python", "javascript", "java"],
      },
    },
    stats: {
      totalStudyTime: 9390, // 156.5 hours
      coursesCompleted: 8,
      coursesEnrolled: 12,
      conceptsMastered: 234,
      problemsSolved: 156,
      quizzesCompleted: 89,
      currentStreak: 15,
      longestStreak: 28,
      level: 12,
      experiencePoints: 15420,
    },
    enrollments: [
      {
        courseId: ObjectId("507f1f77bcf86cd799439012"),
        enrolledAt: new Date("2024-03-01"),
        progress: 75,
        lastAccessedAt: new Date("2024-12-26"),
        rating: 5,
        review: "Excellent course! Really helped me understand DSA concepts.",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-26"),
    lastLoginAt: new Date("2024-12-26"),
    isActive: true,
    emailVerified: true,
    role: "student",
  },
]

// Sample Courses
const sampleCourses = [
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    title: "Complete Data Structures & Algorithms",
    slug: "complete-data-structures-algorithms",
    description:
      "Master the fundamentals of data structures and algorithms with hands-on practice and real-world examples. This comprehensive course covers everything from basic arrays to advanced graph algorithms.",
    shortDescription: "Master DSA with 300+ problems and detailed explanations",
    thumbnail: "https://example.com/course-thumbnails/dsa.jpg",
    instructor: {
      id: ObjectId("507f1f77bcf86cd799439013"),
      name: "Sarah Chen",
      avatar: "https://example.com/instructors/sarah.jpg",
      bio: "Senior Software Engineer at Google with 8+ years of experience",
    },
    category: "Programming",
    subcategory: "Data Structures",
    level: "Beginner to Advanced",
    tags: ["algorithms", "data-structures", "coding-interview", "python", "java"],

    topics: [
      {
        _id: ObjectId("507f1f77bcf86cd799439014"),
        title: "Arrays",
        description: "Master array operations, algorithms, and problem-solving techniques",
        order: 1,
        icon: "target",
        estimatedHours: 12,
        concepts: [
          {
            _id: ObjectId("507f1f77bcf86cd799439015"),
            title: "Array Basics",
            description: "Introduction to arrays, declaration, and basic operations",
            order: 1,
            estimatedTime: "2h 30m",
            difficulty: "Easy",

            videos: [
              {
                _id: ObjectId("507f1f77bcf86cd799439016"),
                title: "What are Arrays?",
                description: "Understanding the fundamental concept of arrays",
                duration: "8:30",
                videoUrl: "https://example.com/videos/array-basics-1.mp4",
                thumbnail: "https://example.com/thumbnails/array-basics-1.jpg",
                order: 1,
                transcription: "Arrays are one of the most fundamental data structures...",
              },
            ],

            articles: [
              {
                _id: ObjectId("507f1f77bcf86cd799439017"),
                title: "Understanding Arrays: A Comprehensive Guide",
                content: "# Understanding Arrays\n\nArrays are fundamental data structures...",
                readTime: "8 min read",
                order: 1,
                author: "Sarah Chen",
                publishedAt: new Date("2024-01-01"),
              },
            ],

            codingProblems: [
              {
                _id: ObjectId("507f1f77bcf86cd799439018"),
                title: "Find Maximum Element",
                description: "Given an array of integers, find and return the maximum element.",
                difficulty: "Easy",
                category: "Arrays",
                hints: [
                  "Iterate through the array and keep track of the maximum value seen so far",
                  "Initialize your maximum with the first element",
                ],
                starterCode: {
                  python: "def find_max(arr):\n    # Write your code here\n    pass",
                  java: "public class Solution {\n    public int findMax(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}",
                  cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMax(vector<int>& arr) {\n        // Write your code here\n        return 0;\n    }\n};",
                  javascript: "function findMax(arr) {\n    // Write your code here\n}",
                },
                solution: {
                  python:
                    "def find_max(arr):\n    if not arr:\n        return None\n    max_val = arr[0]\n    for num in arr[1:]:\n        if num > max_val:\n            max_val = num\n    return max_val",
                },
                testCases: [
                  {
                    input: "[3, 7, 2, 9, 1]",
                    expectedOutput: "9",
                    explanation: "9 is the largest number in the array",
                  },
                  {
                    input: "[-5, -2, -10, -1]",
                    expectedOutput: "-1",
                    explanation: "-1 is the largest among negative numbers",
                  },
                ],
                constraints: ["1 ≤ array length ≤ 1000", "-1000 ≤ array[i] ≤ 1000"],
                timeLimit: 1000,
                memoryLimit: "256 MB",
                order: 1,
              },
            ],

            quiz: {
              _id: ObjectId("507f1f77bcf86cd799439019"),
              title: "Array Basics Quiz",
              description: "Test your understanding of array fundamentals",
              timeLimit: 300,
              passingScore: 70,
              questions: [
                {
                  _id: ObjectId("507f1f77bcf86cd79943901a"),
                  type: "mcq",
                  question: "What is the time complexity of accessing an element in an array by index?",
                  options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                  correctAnswers: [0],
                  explanation: "Array elements can be accessed directly using their index in constant time.",
                  points: 5,
                  difficulty: "Easy",
                },
              ],
              order: 1,
            },
          },
        ],
      },
    ],

    pricing: {
      type: "paid",
      price: 99,
      currency: "USD",
      discountPrice: 79,
      discountEndDate: new Date("2024-12-31"),
    },

    stats: {
      totalStudents: 45234,
      totalRatings: 2847,
      averageRating: 4.9,
      totalReviews: 1205,
      completionRate: 78,
      totalDuration: 720, // 12 hours
      totalConcepts: 85,
      totalVideos: 120,
      totalArticles: 45,
      totalProblems: 300,
      totalQuizzes: 25,
    },

    requirements: ["Basic programming knowledge in any language", "Understanding of basic mathematical concepts"],
    learningOutcomes: [
      "Master fundamental data structures",
      "Solve complex algorithmic problems",
      "Prepare for technical interviews",
      "Understand time and space complexity",
    ],
    targetAudience: [
      "Software engineering students",
      "Junior developers preparing for interviews",
      "Anyone wanting to improve problem-solving skills",
    ],

    status: "published",
    publishedAt: new Date("2024-01-01"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-12-20"),

    seo: {
      metaTitle: "Complete Data Structures & Algorithms Course | Master DSA",
      metaDescription:
        "Learn data structures and algorithms with 300+ practice problems. Perfect for coding interviews and software engineering careers.",
      keywords: ["data structures", "algorithms", "coding interview", "programming", "software engineering"],
    },
  },
]

// Sample Learning Paths
const sampleLearningPaths = [
  {
    _id: ObjectId("507f1f77bcf86cd79943901b"),
    title: "Full Stack Developer",
    description: "Master both frontend and backend development",
    type: "predefined",
    difficulty: "Intermediate",
    estimatedDuration: "16 weeks",
    estimatedHours: 240,
    category: "Web Development",
    tags: ["react", "nodejs", "mongodb", "system-design"],

    steps: [
      {
        _id: ObjectId("507f1f77bcf86cd79943901c"),
        title: "Frontend Basics",
        description: "Learn HTML, CSS, and JavaScript fundamentals",
        type: "course",
        order: 1,
        courseId: ObjectId("507f1f77bcf86cd79943901d"),
        estimatedTime: "4 weeks",
        difficulty: "Beginner",
        completionCriteria: {
          minimumScore: 80,
          requiredActivities: ["videos", "articles", "quiz"],
          masteryThreshold: 7,
        },
      },
    ],

    stats: {
      totalEnrollments: 25000,
      completionRate: 68,
      averageCompletionTime: 112, // days
      averageRating: 4.8,
      totalRatings: 1250,
    },

    status: "published",
    isPublic: true,
    createdBy: ObjectId("507f1f77bcf86cd799439013"),
    createdAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-15"),
  },
]

// Sample Mock Tests
const sampleMockTests = [
  {
    _id: ObjectId("507f1f77bcf86cd79943901e"),
    title: "Data Structures & Algorithms - Complete Assessment",
    description: "Comprehensive test covering arrays, linked lists, trees, graphs, and dynamic programming",
    category: "DSA",
    difficulty: "Mixed",

    duration: 5400, // 90 minutes
    totalQuestions: 25,
    passingScore: 70,
    maxAttempts: 3,

    questionTypes: {
      mcq: 15,
      coding: 10,
      multipleSelect: 0,
      trueFalse: 0,
    },

    questions: [
      {
        _id: ObjectId("507f1f77bcf86cd79943901f"),
        type: "mcq",
        question: "What is the time complexity of inserting an element at the beginning of an array?",
        order: 1,
        points: 5,
        difficulty: "Easy",
        topic: "Arrays",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswers: [2],
        explanation:
          "Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time.",
      },
      {
        _id: ObjectId("507f1f77bcf86cd799439020"),
        type: "coding",
        question: "Implement a function to reverse a linked list iteratively.",
        order: 2,
        points: 15,
        difficulty: "Medium",
        topic: "Linked Lists",
        starterCode: {
          python:
            'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    """\n    :type head: ListNode\n    :rtype: ListNode\n    """\n    # Write your solution here\n    pass',
          java: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n\npublic class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n        return null;\n    }\n}",
        },
        solution: {
          python:
            "def reverseList(head):\n    prev = None\n    current = head\n    while current:\n        next_temp = current.next\n        current.next = prev\n        prev = current\n        current = next_temp\n    return prev",
        },
        testCases: [
          {
            input: "[1,2,3,4,5]",
            expectedOutput: "[5,4,3,2,1]",
            isHidden: false,
          },
          {
            input: "[1,2]",
            expectedOutput: "[2,1]",
            isHidden: false,
          },
          {
            input: "[]",
            expectedOutput: "[]",
            isHidden: true,
          },
        ],
        constraints: ["The number of nodes in the list is the range [0, 5000]", "-5000 <= Node.val <= 5000"],
        timeLimit: 1000,
        memoryLimit: "256 MB",
      },
    ],

    stats: {
      totalAttempts: 15420,
      averageScore: 72.5,
      passRate: 68.2,
      averageCompletionTime: 4680, // seconds
      questionAnalytics: [
        {
          questionId: ObjectId("507f1f77bcf86cd79943901f"),
          correctRate: 85.3,
          averageTime: 45,
          skipRate: 2.1,
        },
      ],
    },

    isPublic: true,
    requiredSubscription: "free",
    prerequisites: [],

    createdBy: ObjectId("507f1f77bcf86cd799439013"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-12-20"),
    publishedAt: new Date("2024-02-15"),
    status: "published",
  },
]

// Sample Achievements
const sampleAchievements = [
  {
    _id: ObjectId("507f1f77bcf86cd799439021"),
    title: "First Course Completed",
    description: "Complete your first course on the platform",
    icon: "trophy",
    category: "learning",
    type: "milestone",
    rarity: "common",

    criteria: {
      type: "course_completion",
      target: 1,
      timeframe: "all_time",
      conditions: [],
    },

    rewards: {
      experiencePoints: 100,
      badge: "first-course-badge",
      title: "Course Completer",
    },

    isProgressive: false,
    isActive: true,
    isSecret: false,
    displayOrder: 1,

    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    title: "Problem Solving Master",
    description: "Solve coding problems to become a master",
    icon: "code",
    category: "skill",
    type: "progressive",
    rarity: "epic",

    criteria: {
      type: "problems_solved",
      target: 500,
      timeframe: "all_time",
      conditions: [],
    },

    rewards: {
      experiencePoints: 1000,
      badge: "problem-master-badge",
      title: "Problem Solving Master",
    },

    isProgressive: true,
    progressSteps: [
      {
        step: 1,
        title: "Problem Solver",
        description: "Solve 10 problems",
        target: 10,
        reward: {
          experiencePoints: 50,
          badge: "solver-bronze",
        },
      },
      {
        step: 2,
        title: "Code Warrior",
        description: "Solve 50 problems",
        target: 50,
        reward: {
          experiencePoints: 200,
          badge: "solver-silver",
        },
      },
      {
        step: 3,
        title: "Algorithm Expert",
        description: "Solve 150 problems",
        target: 150,
        reward: {
          experiencePoints: 500,
          badge: "solver-gold",
        },
      },
      {
        step: 4,
        title: "Problem Solving Master",
        description: "Solve 500 problems",
        target: 500,
        reward: {
          experiencePoints: 1000,
          badge: "solver-master",
        },
      },
    ],

    isActive: true,
    isSecret: false,
    displayOrder: 10,

    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

// Sample Subscription Plans
const sampleSubscriptionPlans = [
  {
    _id: ObjectId("507f1f77bcf86cd799439023"),
    name: "free",
    displayName: "Free",
    description: "Get started with basic access to our platform",

    pricing: {
      monthly: {
        price: 0,
        currency: "USD",
        stripePriceId: null,
      },
      yearly: {
        price: 0,
        currency: "USD",
        stripePriceId: null,
        discount: 0,
      },
    },

    features: {
      coursesAccess: "limited",
      maxCourses: 3,
      downloadContent: false,
      certificatesEnabled: false,
      prioritySupport: false,
      aiTutor: false,
      customLearningPaths: false,
      advancedAnalytics: false,
      mockTestsAccess: "limited",
      maxMockTests: 2,
      codingPlatformAccess: true,
      groupStudy: false,
      mentorshipAccess: false,
    },

    limits: {
      dailyQuizAttempts: 5,
      monthlyMockTests: 2,
      storageLimit: 0,
      apiCallsPerDay: 10,
    },

    isActive: true,
    isPopular: false,
    sortOrder: 1,
    trialDays: 0,

    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439024"),
    name: "premium",
    displayName: "Premium",
    description: "Full access to all courses and premium features",

    pricing: {
      monthly: {
        price: 29.99,
        currency: "USD",
        stripePriceId: "price_premium_monthly",
      },
      yearly: {
        price: 299.99,
        currency: "USD",
        stripePriceId: "price_premium_yearly",
        discount: 17, // ~$60 discount
      },
    },

    features: {
      coursesAccess: "all",
      maxCourses: -1,
      downloadContent: true,
      certificatesEnabled: true,
      prioritySupport: true,
      aiTutor: true,
      customLearningPaths: true,
      advancedAnalytics: true,
      mockTestsAccess: "all",
      maxMockTests: -1,
      codingPlatformAccess: true,
      groupStudy: true,
      mentorshipAccess: false,
    },

    limits: {
      dailyQuizAttempts: -1,
      monthlyMockTests: -1,
      storageLimit: 10240, // 10GB
      apiCallsPerDay: 1000,
    },

    isActive: true,
    isPopular: true,
    sortOrder: 2,
    trialDays: 14,

    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

// Insert sample data
function insertSampleData(database) {
  db = database
  db.users.insertMany(sampleUsers)
  db.courses.insertMany(sampleCourses)
  db.learningPaths.insertMany(sampleLearningPaths)
  db.mockTests.insertMany(sampleMockTests)
  db.achievements.insertMany(sampleAchievements)
  db.subscriptionPlans.insertMany(sampleSubscriptionPlans)
  console.log("Sample data inserted successfully!")
}
