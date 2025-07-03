// Achievement System Schema
const { ObjectId } = require("mongodb")
const achievementSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  icon: String, // icon name or URL
  category: String, // "learning", "streak", "completion", "social", "skill"

  // Achievement Type
  type: String, // "milestone", "progressive", "rare", "time_based"
  rarity: String, // "common", "uncommon", "rare", "epic", "legendary"

  // Unlock Criteria
  criteria: {
    type: String, // "course_completion", "streak", "score", "time_spent", "problems_solved"
    target: Number, // target value to achieve
    timeframe: String, // "daily", "weekly", "monthly", "all_time"
    conditions: [
      {
        field: String, // e.g., "course.category", "quiz.score"
        operator: String, // "equals", "greater_than", "less_than", "in"
        value: {}, // Mixed type - could be string, number, array
      },
    ],
  },

  // Rewards
  rewards: {
    experiencePoints: Number,
    badge: String,
    title: String, // special title for user profile
    unlocks: [String], // features or content unlocked
  },

  // Progress Tracking (for progressive achievements)
  isProgressive: Boolean,
  progressSteps: [
    {
      step: Number,
      title: String,
      description: String,
      target: Number,
      reward: {
        experiencePoints: Number,
        badge: String,
      },
    },
  ],

  // Metadata
  isActive: Boolean,
  isSecret: Boolean, // hidden until unlocked
  displayOrder: Number,

  createdAt: Date,
  updatedAt: Date,
}

// User Achievement Progress Schema
const userAchievementSchema = {
  _id: ObjectId,
  userId: ObjectId,
  achievementId: ObjectId,

  // Progress Tracking
  currentProgress: Number,
  targetProgress: Number,
  progressPercentage: Number,

  // Status
  status: String, // "locked", "in_progress", "completed"
  unlockedAt: Date,

  // Progressive Achievement Tracking
  completedSteps: [Number], // for progressive achievements
  currentStep: Number,

  // Metadata
  firstProgressAt: Date, // when user first made progress
  lastProgressAt: Date,

  // Notification
  notificationSent: Boolean,
  viewedByUser: Boolean,
}

// Indexes
const db = require("./db") // Assuming db is imported from a module
db.achievements.createIndex({ category: 1, type: 1 })
db.achievements.createIndex({ isActive: 1, displayOrder: 1 })
db.achievements.createIndex({ rarity: 1 })

db.userAchievements.createIndex({ userId: 1 })
db.userAchievements.createIndex({ userId: 1, status: 1 })
db.userAchievements.createIndex({ achievementId: 1 })
db.userAchievements.createIndex({ unlockedAt: -1 })
