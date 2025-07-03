// Import ObjectId from mongoose
const { ObjectId } = require("mongoose").Types

// Notification System Schema
const notificationSchema = {
  _id: ObjectId,
  userId: ObjectId,

  // Notification Content
  title: String,
  message: String,
  type: String, // "achievement", "reminder", "course_update", "system", "social"
  category: String, // "learning", "account", "marketing", "technical"

  // Notification Data
  data: {
    // Achievement notifications
    achievementId: ObjectId,

    // Course notifications
    courseId: ObjectId,
    conceptId: ObjectId,

    // Reminder notifications
    reminderType: String, // "daily_goal", "course_deadline", "streak_risk"

    // System notifications
    updateType: String, // "feature", "maintenance", "policy"

    // Action data
    actionUrl: String, // deep link to relevant page
    actionText: String, // "Continue Learning", "View Achievement", etc.
  },

  // Delivery
  channels: [String], // "in_app", "email", "push"
  priority: String, // "low", "normal", "high", "urgent"

  // Status
  status: String, // "pending", "sent", "delivered", "read", "dismissed"
  sentAt: Date,
  readAt: Date,
  dismissedAt: Date,

  // Scheduling
  scheduledFor: Date, // for scheduled notifications
  expiresAt: Date, // when notification becomes irrelevant

  // Metadata
  createdAt: Date,
  updatedAt: Date,
}

// Notification Preferences Schema (embedded in User)
const notificationPreferencesSchema = {
  email: {
    enabled: Boolean,
    frequency: String, // "immediate", "daily", "weekly", "never"
    types: {
      achievements: Boolean,
      courseUpdates: Boolean,
      reminders: Boolean,
      marketing: Boolean,
      system: Boolean,
    },
  },
  push: {
    enabled: Boolean,
    types: {
      achievements: Boolean,
      reminders: Boolean,
      courseUpdates: Boolean,
      social: Boolean,
    },
  },
  inApp: {
    enabled: Boolean,
    types: {
      achievements: Boolean,
      reminders: Boolean,
      courseUpdates: Boolean,
      social: Boolean,
      system: Boolean,
    },
  },
  reminders: {
    dailyGoal: {
      enabled: Boolean,
      time: String, // "09:00"
      timezone: String,
    },
    streakRisk: {
      enabled: Boolean,
      hoursBeforeRisk: Number, // notify X hours before streak breaks
    },
    courseDeadlines: {
      enabled: Boolean,
      daysBefore: Number, // notify X days before deadline
    },
  },
}

// Email Campaign Schema
const emailCampaignSchema = {
  _id: ObjectId,
  name: String,
  subject: String,
  content: String, // HTML content

  // Targeting
  targetAudience: {
    userSegment: String, // "all", "premium", "free", "inactive", "new"
    filters: [
      {
        field: String, // "subscription.plan", "stats.coursesCompleted"
        operator: String,
        value: {},
      },
    ],
    excludeUsers: [ObjectId], // users to exclude
  },

  // Campaign Settings
  type: String, // "promotional", "educational", "transactional", "newsletter"
  priority: String,

  // Scheduling
  scheduledFor: Date,
  timezone: String,

  // Status
  status: String, // "draft", "scheduled", "sending", "sent", "cancelled"

  // Analytics
  stats: {
    totalRecipients: Number,
    delivered: Number,
    opened: Number,
    clicked: Number,
    unsubscribed: Number,
    bounced: Number,
    openRate: Number, // percentage
    clickRate: Number, // percentage
    unsubscribeRate: Number,
  },

  createdBy: ObjectId, // admin user ID
  createdAt: Date,
  sentAt: Date,
}

// Declare db variable
const db = require("./db") // Assuming db is exported from a db module

// Indexes
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, status: 1 })
db.notifications.createIndex({ type: 1, createdAt: -1 })
db.notifications.createIndex({ scheduledFor: 1, status: 1 })
db.notifications.createIndex({ expiresAt: 1 })

db.emailCampaigns.createIndex({ status: 1, scheduledFor: 1 })
db.emailCampaigns.createIndex({ createdBy: 1, createdAt: -1 })
