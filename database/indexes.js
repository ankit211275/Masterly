// Comprehensive Index Strategy for Educational Platform

const db = require("./db") // Declare the db variable

// User Collection Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ "profile.displayName": "text" }) // Text search
db.users.createIndex({ "subscription.status": 1, "subscription.endDate": 1 })
db.users.createIndex({ createdAt: -1 })
db.users.createIndex({ lastLoginAt: -1 })
db.users.createIndex({ "stats.level": -1, "stats.experiencePoints": -1 })
db.users.createIndex({ role: 1 })

// Course Collection Indexes
db.courses.createIndex({ slug: 1 }, { unique: true })
db.courses.createIndex({ title: "text", description: "text", tags: "text" }) // Full-text search
db.courses.createIndex({ category: 1, subcategory: 1, level: 1 })
db.courses.createIndex({ status: 1, publishedAt: -1 })
db.courses.createIndex({ "stats.averageRating": -1, "stats.totalStudents": -1 })
db.courses.createIndex({ "instructor.id": 1 })
db.courses.createIndex({ "pricing.type": 1, "pricing.price": 1 })

// User Progress Indexes
db.userProgress.createIndex({ userId: 1, courseId: 1 }, { unique: true })
db.userProgress.createIndex({ userId: 1, lastAccessedAt: -1 })
db.userProgress.createIndex({ courseId: 1, overallProgress: -1 })
db.userProgress.createIndex({ "analytics.dailyActivity.date": -1 })

// Learning Path Indexes
db.learningPaths.createIndex({ type: 1, category: 1 })
db.learningPaths.createIndex({ status: 1, isPublic: 1 })
db.learningPaths.createIndex({ createdBy: 1, createdAt: -1 })
db.learningPaths.createIndex({ "stats.averageRating": -1 })

db.userLearningPaths.createIndex({ userId: 1, status: 1 })
db.userLearningPaths.createIndex({ learningPathId: 1, overallProgress: -1 })

// Assessment Indexes
db.mockTests.createIndex({ category: 1, difficulty: 1 })
db.mockTests.createIndex({ status: 1, isPublic: 1 })
db.mockTests.createIndex({ "stats.averageScore": -1, "stats.totalAttempts": -1 })

db.mockTestAttempts.createIndex({ userId: 1, submittedAt: -1 })
db.mockTestAttempts.createIndex({ mockTestId: 1, totalScore: -1 })
db.mockTestAttempts.createIndex({ userId: 1, mockTestId: 1, attemptNumber: 1 })

db.quizAttempts.createIndex({ userId: 1, courseId: 1, completedAt: -1 })
db.quizAttempts.createIndex({ quizId: 1, score: -1 })

// Achievement Indexes
db.achievements.createIndex({ category: 1, type: 1, isActive: 1 })
db.achievements.createIndex({ displayOrder: 1 })

db.userAchievements.createIndex({ userId: 1, status: 1 })
db.userAchievements.createIndex({ achievementId: 1, unlockedAt: -1 })
db.userAchievements.createIndex({ userId: 1, unlockedAt: -1 })

// Analytics Indexes
db.learningSessions.createIndex({ userId: 1, startTime: -1 })
db.learningSessions.createIndex({ sessionId: 1 }, { unique: true })

db.dailyAnalytics.createIndex({ userId: 1, date: -1 })
db.dailyAnalytics.createIndex({ date: -1, totalTimeSpent: -1 })

db.periodicAnalytics.createIndex({ userId: 1, period: 1, startDate: -1 })

db.courseAnalytics.createIndex({ courseId: 1, date: -1 })
db.courseAnalytics.createIndex({ date: -1, totalEnrollments: -1 })

// Notification Indexes
db.notifications.createIndex({ userId: 1, status: 1, createdAt: -1 })
db.notifications.createIndex({ type: 1, scheduledFor: 1 })
db.notifications.createIndex({ expiresAt: 1 }) // For cleanup

// Subscription & Payment Indexes
db.subscriptionPlans.createIndex({ isActive: 1, sortOrder: 1 })

db.paymentTransactions.createIndex({ userId: 1, createdAt: -1 })
db.paymentTransactions.createIndex({ status: 1, createdAt: -1 })
db.paymentTransactions.createIndex({ stripePaymentIntentId: 1 }, { unique: true })

db.coupons.createIndex({ code: 1 }, { unique: true })
db.coupons.createIndex({ isActive: 1, validFrom: 1, validUntil: 1 })

// Compound Indexes for Complex Queries
db.courses.createIndex({
  category: 1,
  level: 1,
  "stats.averageRating": -1,
  "pricing.type": 1,
})

db.userProgress.createIndex({
  userId: 1,
  "topicProgress.masteryScore": -1,
  lastAccessedAt: -1,
})

db.mockTestAttempts.createIndex({
  userId: 1,
  passed: 1,
  submittedAt: -1,
})

// TTL Indexes for automatic cleanup
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.learningSessions.createIndex({ endTime: 1 }, { expireAfterSeconds: 7776000 }) // 90 days

// Partial Indexes for specific use cases
db.users.createIndex(
  { "subscription.endDate": 1 },
  {
    partialFilterExpression: {
      "subscription.status": { $in: ["active", "trial"] },
    },
  },
)

db.courses.createIndex(
  { publishedAt: -1 },
  {
    partialFilterExpression: {
      status: "published",
    },
  },
)

// Sparse Indexes for optional fields
db.users.createIndex({ "profile.website": 1 }, { sparse: true })
db.courses.createIndex({ "pricing.discountEndDate": 1 }, { sparse: true })
