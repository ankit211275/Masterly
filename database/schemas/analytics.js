// Learning Analytics Schema
const { ObjectId } = require("mongodb")
const learningSessionSchema = {
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String, // unique session identifier

  // Session Details
  startTime: Date,
  endTime: Date,
  duration: Number, // minutes

  // Activity Tracking
  activities: [
    {
      type: String, // "video_watch", "article_read", "problem_solve", "quiz_take"
      resourceId: ObjectId, // video/article/problem/quiz ID
      courseId: ObjectId,
      conceptId: ObjectId,
      startTime: Date,
      endTime: Date,
      duration: Number, // seconds

      // Activity-specific data
      metadata: {
        // For videos
        watchPercentage: Number,
        playbackSpeed: Number,
        pauseCount: Number,
        seekCount: Number,

        // For articles
        readPercentage: Number,
        scrollDepth: Number,

        // For problems
        attempts: Number,
        hintsUsed: Number,
        solved: Boolean,

        // For quizzes
        score: Number,
        questionsAnswered: Number,
      },
    },
  ],

  // Device/Browser Info
  deviceInfo: {
    userAgent: String,
    platform: String, // "web", "mobile", "tablet"
    browser: String,
    os: String,
    screenResolution: String,
  },

  // Location (if available)
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String,
  },
}

// Daily Learning Analytics
const dailyAnalyticsSchema = {
  _id: ObjectId,
  userId: ObjectId,
  date: Date, // YYYY-MM-DD format

  // Time Tracking
  totalTimeSpent: Number, // minutes
  sessionCount: Number,
  averageSessionLength: Number, // minutes

  // Activity Counts
  videosWatched: Number,
  articlesRead: Number,
  problemsSolved: Number,
  quizzesTaken: Number,
  conceptsCompleted: Number,

  // Performance Metrics
  averageQuizScore: Number,
  problemsSolvedCorrectly: Number,
  totalProblemsAttempted: Number,

  // Engagement Metrics
  loginCount: Number,
  firstLoginTime: Date,
  lastLoginTime: Date,

  // Course Progress
  coursesAccessed: [ObjectId],
  newConceptsStarted: Number,
  conceptsCompleted: Number,

  // Streak Information
  isStreakDay: Boolean,
  currentStreak: Number,

  createdAt: Date,
}

// Weekly/Monthly Aggregated Analytics
const periodicAnalyticsSchema = {
  _id: ObjectId,
  userId: ObjectId,
  period: String, // "week", "month"
  startDate: Date,
  endDate: Date,

  // Aggregated Metrics
  totalTimeSpent: Number, // minutes
  totalSessions: Number,
  averageSessionLength: Number,
  activeDays: Number,

  // Learning Progress
  conceptsCompleted: Number,
  coursesCompleted: Number,
  videosWatched: Number,
  articlesRead: Number,
  problemsSolved: Number,
  quizzesTaken: Number,

  // Performance Trends
  averageQuizScore: Number,
  problemSolveRate: Number, // percentage
  improvementRate: Number, // compared to previous period

  // Engagement Patterns
  preferredStudyTimes: [String], // ["09:00-10:00", "20:00-21:00"]
  mostActiveDay: String,
  longestSession: Number, // minutes

  // Goal Achievement
  dailyGoalAchieved: Number, // days goal was met
  weeklyGoalAchieved: Boolean,

  createdAt: Date,
}

// Course Analytics (aggregated data for courses)
const courseAnalyticsSchema = {
  _id: ObjectId,
  courseId: ObjectId,
  date: Date, // daily aggregation

  // Enrollment Metrics
  newEnrollments: Number,
  totalEnrollments: Number,
  activeStudents: Number, // students who accessed course today

  // Engagement Metrics
  totalTimeSpent: Number, // minutes across all students
  averageTimePerStudent: Number,
  totalSessions: Number,

  // Content Metrics
  videoViews: Number,
  articleReads: Number,
  problemAttempts: Number,
  quizAttempts: Number,

  // Performance Metrics
  averageProgress: Number, // percentage
  completionRate: Number, // percentage of enrolled students who completed
  averageQuizScore: Number,
  problemSolveRate: Number,

  // Popular Content
  mostWatchedVideos: [
    {
      videoId: ObjectId,
      views: Number,
      averageWatchTime: Number,
    },
  ],
  mostReadArticles: [
    {
      articleId: ObjectId,
      reads: Number,
      averageReadTime: Number,
    },
  ],

  // Difficulty Analysis
  conceptDifficulty: [
    {
      conceptId: ObjectId,
      averageTimeSpent: Number,
      completionRate: Number,
      averageScore: Number,
      dropoffRate: Number, // percentage who started but didn't complete
    },
  ],

  createdAt: Date,
}

// Indexes
const db = require("./db") // Assuming db is imported from a module
db.learningSessions.createIndex({ userId: 1, startTime: -1 })
db.learningSessions.createIndex({ sessionId: 1 }, { unique: true })
db.learningSessions.createIndex({ startTime: -1 })

db.dailyAnalytics.createIndex({ userId: 1, date: -1 })
db.dailyAnalytics.createIndex({ date: -1 })
db.dailyAnalytics.createIndex({ userId: 1, isStreakDay: 1 })

db.periodicAnalytics.createIndex({ userId: 1, period: 1, startDate: -1 })
db.periodicAnalytics.createIndex({ period: 1, startDate: -1 })

db.courseAnalytics.createIndex({ courseId: 1, date: -1 })
db.courseAnalytics.createIndex({ date: -1 })
