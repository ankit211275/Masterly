// Import ObjectId from MongoDB
const { ObjectId } = require("mongodb")

// Learning Path Collection Schema
const learningPathSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  type: String, // "predefined", "custom", "ai_generated"

  // Path Metadata
  difficulty: String, // "Beginner", "Intermediate", "Advanced", "Mixed"
  estimatedDuration: String, // "16 weeks"
  estimatedHours: Number,
  category: String,
  tags: [String],

  // Path Structure
  steps: [
    {
      _id: ObjectId,
      title: String,
      description: String,
      type: String, // "course", "topic", "concept", "skill_assessment"
      order: Number,

      // References
      courseId: ObjectId, // if type is "course"
      topicId: ObjectId, // if type is "topic"
      conceptId: ObjectId, // if type is "concept"

      // Step Requirements
      prerequisites: [ObjectId], // other step IDs that must be completed first
      estimatedTime: String,
      difficulty: String,

      // Completion Criteria
      completionCriteria: {
        minimumScore: Number, // percentage
        requiredActivities: [String], // ["videos", "articles", "problems", "quiz"]
        masteryThreshold: Number, // 0-10 scale
      },
    },
  ],

  // Path Analytics
  stats: {
    totalEnrollments: Number,
    completionRate: Number,
    averageCompletionTime: Number, // days
    averageRating: Number,
    totalRatings: Number,
  },

  // AI Generation Data (for custom paths)
  aiGeneration: {
    userGoals: [String],
    currentSkillLevel: String,
    timeAvailable: String, // "1-2 hours/day"
    preferredLearningStyle: String,
    targetRole: String, // "Software Engineer", "Data Scientist", etc.
    generatedAt: Date,
    algorithm: String, // AI algorithm used
    confidence: Number, // 0-1 scale
  },

  // Publishing
  status: String, // "draft", "published", "archived"
  isPublic: Boolean, // can other users see/enroll in this path
  createdBy: ObjectId, // User ID

  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
}

// User Learning Path Progress
const userLearningPathSchema = {
  _id: ObjectId,
  userId: ObjectId,
  learningPathId: ObjectId,

  // Progress Tracking
  currentStep: Number, // index of current step
  overallProgress: Number, // percentage
  completedSteps: [ObjectId], // step IDs

  // Step Progress Details
  stepProgress: [
    {
      stepId: ObjectId,
      status: String, // "not_started", "in_progress", "completed", "skipped"
      startedAt: Date,
      completedAt: Date,
      timeSpent: Number, // minutes
      score: Number, // if applicable
      notes: String, // user notes for this step
    },
  ],

  // Path Analytics
  analytics: {
    totalTimeSpent: Number, // minutes
    averageSessionTime: Number, // minutes
    studyStreak: Number, // consecutive days
    completionPrediction: Date, // AI-predicted completion date
    difficultyRating: Number, // user's rating of path difficulty (1-5)
    satisfactionRating: Number, // user's satisfaction rating (1-5)
  },

  // Customization
  customizations: {
    skippedSteps: [ObjectId], // steps user chose to skip
    addedSteps: [ObjectId], // additional steps user added
    modifiedOrder: [ObjectId], // if user reordered steps
    personalNotes: String,
  },

  enrolledAt: Date,
  startedAt: Date,
  completedAt: Date,
  lastAccessedAt: Date,
  status: String, // "active", "paused", "completed", "abandoned"
}

// Import db from MongoDB connection
const db = require("./dbConnection")

// Indexes
db.learningPaths.createIndex({ type: 1 })
db.learningPaths.createIndex({ category: 1 })
db.learningPaths.createIndex({ difficulty: 1 })
db.learningPaths.createIndex({ status: 1, isPublic: 1 })
db.learningPaths.createIndex({ createdBy: 1 })
db.learningPaths.createIndex({ "stats.averageRating": -1 })

db.userLearningPaths.createIndex({ userId: 1, learningPathId: 1 }, { unique: true })
db.userLearningPaths.createIndex({ userId: 1 })
db.userLearningPaths.createIndex({ status: 1 })
db.userLearningPaths.createIndex({ lastAccessedAt: -1 })
