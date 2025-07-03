# Educational Platform - MongoDB Database Schema

This document outlines the complete MongoDB database schema for the educational platform, designed to support scalability, performance, and the rich feature set of the application.

## Overview

The database is designed with the following principles:
- **Embedded vs Referenced**: Strategic use of embedding for frequently accessed related data and referencing for large or independently managed entities
- **Scalability**: Proper indexing and data modeling for horizontal scaling
- **Performance**: Optimized queries through compound indexes and data denormalization where appropriate
- **Flexibility**: Schema design that accommodates future feature additions

## Collections Overview

### Core Collections

1. **users** - User accounts, profiles, and preferences
2. **courses** - Course content, structure, and metadata
3. **userProgress** - Individual user progress tracking
4. **learningPaths** - Predefined and custom learning journeys
5. **userLearningPaths** - User enrollment and progress in learning paths

### Assessment Collections

6. **mockTests** - Mock test definitions and questions
7. **mockTestAttempts** - User attempts and results
8. **quizAttempts** - Course quiz attempts and scores

### Engagement Collections

9. **achievements** - Achievement definitions
10. **userAchievements** - User achievement progress
11. **notifications** - User notifications and preferences
12. **emailCampaigns** - Marketing and educational email campaigns

### Analytics Collections

13. **learningSessions** - Detailed user activity tracking
14. **dailyAnalytics** - Daily aggregated user metrics
15. **periodicAnalytics** - Weekly/monthly analytics
16. **courseAnalytics** - Course-level analytics

### Business Collections

17. **subscriptionPlans** - Subscription plan definitions
18. **paymentTransactions** - Payment history and billing
19. **coupons** - Discount codes and promotions

## Key Design Decisions

### Embedding vs Referencing

**Embedded Documents:**
- Course topics and concepts (1-to-few relationship, accessed together)
- User preferences and stats (small, frequently accessed)
- Quiz questions within courses (accessed together)
- Achievement progress steps (small, related data)

**Referenced Documents:**
- User enrollments reference courses (many-to-many)
- Learning path steps reference courses/topics (flexibility)
- User progress references courses (large, independent updates)
- Mock test attempts reference tests (large, independent)

### Denormalization Strategy

Strategic denormalization for performance:
- Instructor info embedded in courses (reduces joins)
- Course stats embedded for quick access
- User stats embedded in user document
- Achievement metadata in user achievements

### Indexing Strategy

**Primary Indexes:**
- Unique indexes on email, course slug, coupon codes
- Compound indexes for common query patterns
- Text indexes for search functionality
- TTL indexes for automatic cleanup

**Performance Indexes:**
- User activity queries (userId + timestamp)
- Course discovery (category + level + rating)
- Analytics queries (date-based ranges)
- Subscription management (status + dates)

## Data Relationships

\`\`\`
Users
├── enrollments → Courses
├── learningPaths → LearningPaths
├── achievements → Achievements
└── progress → UserProgress

Courses
├── topics (embedded)
│   └── concepts (embedded)
│       ├── videos (embedded)
│       ├── articles (embedded)
│       ├── problems (embedded)
│       └── quiz (embedded)
└── analytics → CourseAnalytics

LearningPaths
└── steps → Courses/Topics/Concepts

MockTests
├── questions (embedded)
└── attempts → MockTestAttempts

Analytics
├── sessions → LearningSessions
├── daily → DailyAnalytics
└── periodic → PeriodicAnalytics
\`\`\`

## Scalability Considerations

### Horizontal Scaling
- Sharding key recommendations:
  - Users: `userId` (even distribution)
  - UserProgress: `userId` (co-locate user data)
  - Analytics: `date` + `userId` (time-based queries)

### Data Growth Management
- TTL indexes for session data (90 days)
- Archival strategy for old analytics data
- Pagination for large result sets
- Aggregation pipelines for complex analytics

### Performance Optimization
- Read replicas for analytics queries
- Caching layer for frequently accessed course data
- Background jobs for heavy aggregations
- Optimistic concurrency for progress updates

## Security Considerations

### Data Protection
- Password hashing with bcrypt
- PII encryption for sensitive fields
- Audit trails for data modifications
- Role-based access control

### Privacy Compliance
- User data export capabilities
- Data deletion workflows
- Consent tracking
- Anonymization for analytics

## Monitoring and Maintenance

### Key Metrics to Monitor
- Query performance (slow query log)
- Index usage and efficiency
- Collection growth rates
- Connection pool utilization

### Maintenance Tasks
- Index optimization reviews
- Data archival processes
- Performance tuning
- Schema migration planning

## Usage Examples

### Common Query Patterns

\`\`\`javascript
// Find user's active courses with progress
db.users.aggregate([
  { $match: { _id: userId } },
  { $lookup: {
      from: "userProgress",
      localField: "_id",
      foreignField: "userId",
      as: "progress"
  }},
  { $lookup: {
      from: "courses",
      localField: "enrollments.courseId",
      foreignField: "_id",
      as: "courses"
  }}
])

// Course discovery with filters
db.courses.find({
  status: "published",
  category: "Programming",
  level: { $in: ["Beginner", "Intermediate"] },
  "stats.averageRating": { $gte: 4.0 }
}).sort({ "stats.totalStudents": -1 })

// User learning analytics
db.dailyAnalytics.aggregate([
  { $match: { 
      userId: userId,
      date: { $gte: startDate, $lte: endDate }
  }},
  { $group: {
      _id: null,
      totalTime: { $sum: "$totalTimeSpent" },
      avgScore: { $avg: "$averageQuizScore" },
      conceptsCompleted: { $sum: "$conceptsCompleted" }
  }}
])
\`\`\`

## Migration and Versioning

### Schema Versioning
- Document version fields for major changes
- Backward compatibility considerations
- Migration scripts for data transformations
- Rollback procedures

### Deployment Strategy
- Blue-green deployments for schema changes
- Feature flags for new functionality
- Gradual rollout of breaking changes
- Data validation during migrations

This schema provides a robust foundation for the educational platform while maintaining flexibility for future enhancements and scale.
