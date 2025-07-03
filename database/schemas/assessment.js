// Import ObjectId from mongoose
const { ObjectId } = require("mongoose").Types

// Mock Test Collection Schema
const mockTestSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // "DSA", "System Design", "Full Stack", etc.
  difficulty: String, // "Easy", "Medium", "Hard", "Mixed"

  // Test Configuration
  duration: Number, // seconds
  totalQuestions: Number,
  passingScore: Number, // percentage
  maxAttempts: Number, // 0 for unlimited

  // Question Distribution
  questionTypes: {
    mcq: Number, // number of MCQ questions
    coding: Number, // number of coding questions
    multipleSelect: Number,
    trueFalse: Number,
  },

  // Questions
  questions: [
    {
      _id: ObjectId,
      type: String, // "mcq", "coding", "multiple_select", "true_false"
      question: String,
      order: Number,
      points: Number,
      difficulty: String,
      topic: String,

      // MCQ/Multiple Select specific
      options: [String],
      correctAnswers: [Number], // indexes
      explanation: String,

      // Coding specific
      starterCode: {
        python: String,
        java: String,
        cpp: String,
        javascript: String,
      },
      solution: {
        python: String,
        java: String,
        cpp: String,
        javascript: String,
      },
      testCases: [
        {
          input: String,
          expectedOutput: String,
          isHidden: Boolean, // hidden test cases for evaluation
        },
      ],
      constraints: [String],
      timeLimit: Number, // milliseconds for code execution
      memoryLimit: String,
    },
  ],

  // Test Analytics
  stats: {
    totalAttempts: Number,
    averageScore: Number,
    passRate: Number, // percentage of users who passed
    averageCompletionTime: Number, // seconds
    questionAnalytics: [
      {
        questionId: ObjectId,
        correctRate: Number, // percentage of correct answers
        averageTime: Number, // seconds spent on question
        skipRate: Number, // percentage who skipped
      },
    ],
  },

  // Access Control
  isPublic: Boolean,
  requiredSubscription: String, // "free", "premium"
  prerequisites: [ObjectId], // course/topic IDs

  createdBy: ObjectId, // User ID
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
  status: String, // "draft", "published", "archived"
}

// User Mock Test Attempt Schema
const mockTestAttemptSchema = {
  _id: ObjectId,
  userId: ObjectId,
  mockTestId: ObjectId,
  attemptNumber: Number,

  // Attempt Details
  startedAt: Date,
  submittedAt: Date,
  timeSpent: Number, // seconds
  status: String, // "in_progress", "completed", "abandoned", "time_expired"

  // Scoring
  totalScore: Number, // percentage
  totalPoints: Number,
  maxPoints: Number,
  passed: Boolean,
  percentile: Number, // compared to other test takers

  // Question Responses
  responses: [
    {
      questionId: ObjectId,
      questionType: String,

      // MCQ/Multiple Select Response
      selectedAnswers: [Number], // indexes of selected options

      // Coding Response
      code: String,
      language: String,
      testCaseResults: [
        {
          testCaseId: ObjectId,
          passed: Boolean,
          actualOutput: String,
          executionTime: Number, // milliseconds
          memoryUsed: Number, // bytes
          error: String, // if any runtime error
        },
      ],

      // Common Fields
      isCorrect: Boolean,
      pointsEarned: Number,
      timeSpent: Number, // seconds on this question
      flaggedForReview: Boolean,
      submittedAt: Date,
    },
  ],

  // Performance Analysis
  analysis: {
    topicPerformance: [
      {
        topic: String,
        questionsAttempted: Number,
        correctAnswers: Number,
        accuracy: Number, // percentage
        averageTime: Number, // seconds per question
      },
    ],
    difficultyPerformance: [
      {
        difficulty: String,
        questionsAttempted: Number,
        correctAnswers: Number,
        accuracy: Number,
      },
    ],
    strengths: [String], // topics where user performed well
    weaknesses: [String], // topics needing improvement
    recommendations: [String], // AI-generated study recommendations
  },

  // Review Data
  reviewSession: {
    startedAt: Date,
    questionsReviewed: [ObjectId],
    timeSpent: Number, // seconds in review
    notesAdded: [
      {
        questionId: ObjectId,
        note: String,
        addedAt: Date,
      },
    ],
  },
}

// Quiz Attempt Schema (for course quizzes)
const quizAttemptSchema = {
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  conceptId: ObjectId,
  quizId: ObjectId,
  attemptNumber: Number,

  startedAt: Date,
  completedAt: Date,
  timeSpent: Number, // seconds

  score: Number, // percentage
  totalQuestions: Number,
  correctAnswers: Number,
  passed: Boolean,

  answers: [
    {
      questionId: ObjectId,
      selectedAnswers: [Number],
      isCorrect: Boolean,
      timeSpent: Number,
      pointsEarned: Number,
    },
  ],

  status: String, // "completed", "abandoned"
}

// Import db from wherever it is defined
const db = require("./path_to_db")

// Indexes
db.mockTests.createIndex({ category: 1, difficulty: 1 })
db.mockTests.createIndex({ status: 1, isPublic: 1 })
db.mockTests.createIndex({ createdBy: 1 })
db.mockTests.createIndex({ "stats.averageScore": -1 })

db.mockTestAttempts.createIndex({ userId: 1, mockTestId: 1 })
db.mockTestAttempts.createIndex({ userId: 1, submittedAt: -1 })
db.mockTestAttempts.createIndex({ mockTestId: 1, submittedAt: -1 })

db.quizAttempts.createIndex({ userId: 1, quizId: 1 })
db.quizAttempts.createIndex({ userId: 1, courseId: 1 })
