// Import ObjectId from mongoose
const { ObjectId } = require("mongoose").Types

// Subscription Plans Schema
const subscriptionPlanSchema = {
  _id: ObjectId,
  name: String, // "Free", "Premium", "Enterprise"
  displayName: String,
  description: String,

  // Pricing
  pricing: {
    monthly: {
      price: Number,
      currency: String,
      stripePriceId: String, // Stripe price ID
    },
    yearly: {
      price: Number,
      currency: String,
      stripePriceId: String,
      discount: Number, // percentage discount
    },
  },

  // Features
  features: {
    coursesAccess: String, // "limited", "all", "premium_only"
    maxCourses: Number, // -1 for unlimited
    downloadContent: Boolean,
    certificatesEnabled: Boolean,
    prioritySupport: Boolean,
    aiTutor: Boolean,
    customLearningPaths: Boolean,
    advancedAnalytics: Boolean,
    mockTestsAccess: String, // "limited", "all"
    maxMockTests: Number, // per month, -1 for unlimited
    codingPlatformAccess: Boolean,
    groupStudy: Boolean,
    mentorshipAccess: Boolean,
  },

  // Limits
  limits: {
    dailyQuizAttempts: Number, // -1 for unlimited
    monthlyMockTests: Number,
    storageLimit: Number, // MB for downloaded content
    apiCallsPerDay: Number, // for AI features
  },

  // Plan Settings
  isActive: Boolean,
  isPopular: Boolean, // highlight as popular choice
  sortOrder: Number,
  trialDays: Number, // free trial period

  createdAt: Date,
  updatedAt: Date,
}

// User Subscription Schema (embedded in User collection)
const userSubscriptionSchema = {
  planId: ObjectId, // reference to SubscriptionPlan
  status: String, // "active", "cancelled", "expired", "trial", "past_due"

  // Billing
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  billingCycle: String, // "monthly", "yearly"
  autoRenew: Boolean,

  // Payment
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  paymentMethod: {
    type: String, // "card", "paypal"
    last4: String, // last 4 digits of card
    brand: String, // "visa", "mastercard"
    expiryMonth: Number,
    expiryYear: Number,
  },

  // Trial
  trialStart: Date,
  trialEnd: Date,
  isTrialUsed: Boolean,

  // Cancellation
  cancelledAt: Date,
  cancelReason: String,
  cancelAtPeriodEnd: Boolean,

  // Usage Tracking
  currentUsage: {
    mockTestsThisMonth: Number,
    quizAttemptsToday: Number,
    apiCallsToday: Number,
    storageUsed: Number, // MB
  },

  // History
  subscriptionHistory: [
    {
      planId: ObjectId,
      startDate: Date,
      endDate: Date,
      status: String,
      billingCycle: String,
      amount: Number,
      currency: String,
    },
  ],

  createdAt: Date,
  updatedAt: Date,
}

// Payment Transaction Schema
const paymentTransactionSchema = {
  _id: ObjectId,
  userId: ObjectId,
  subscriptionId: ObjectId,

  // Transaction Details
  stripePaymentIntentId: String,
  stripeChargeId: String,
  amount: Number,
  currency: String,

  // Status
  status: String, // "pending", "succeeded", "failed", "cancelled", "refunded"
  paymentMethod: String, // "card", "paypal", "bank_transfer"

  // Billing Period
  billingPeriodStart: Date,
  billingPeriodEnd: Date,

  // Invoice
  invoiceId: String,
  invoiceUrl: String,
  receiptUrl: String,

  // Failure Information
  failureCode: String,
  failureMessage: String,

  // Refund Information
  refundedAt: Date,
  refundAmount: Number,
  refundReason: String,

  // Metadata
  description: String,
  metadata: {}, // additional Stripe metadata

  createdAt: Date,
  updatedAt: Date,
}

// Coupon/Discount Schema
const couponSchema = {
  _id: ObjectId,
  code: String, // unique coupon code
  name: String,
  description: String,

  // Discount Details
  type: String, // "percentage", "fixed_amount"
  value: Number, // percentage (0-100) or fixed amount
  currency: String, // for fixed amount coupons

  // Validity
  validFrom: Date,
  validUntil: Date,
  maxUses: Number, // -1 for unlimited
  usedCount: Number,

  // Restrictions
  applicablePlans: [ObjectId], // specific plans this coupon applies to
  minimumAmount: Number, // minimum purchase amount
  firstTimeOnly: Boolean, // only for new subscribers

  // Status
  isActive: Boolean,

  // Usage Tracking
  usedBy: [
    {
      userId: ObjectId,
      usedAt: Date,
      subscriptionId: ObjectId,
      discountAmount: Number,
    },
  ],

  createdBy: ObjectId, // admin user ID
  createdAt: Date,
  updatedAt: Date,
}

// Import db from your database connection file
const db = require("./yourDatabaseConnectionFile")

// Indexes
db.subscriptionPlans.createIndex({ isActive: 1, sortOrder: 1 })
db.subscriptionPlans.createIndex({ name: 1 }, { unique: true })

db.paymentTransactions.createIndex({ userId: 1, createdAt: -1 })
db.paymentTransactions.createIndex({ status: 1, createdAt: -1 })
db.paymentTransactions.createIndex({ stripePaymentIntentId: 1 }, { unique: true })

db.coupons.createIndex({ code: 1 }, { unique: true })
db.coupons.createIndex({ isActive: 1, validFrom: 1, validUntil: 1 })
db.coupons.createIndex({ validUntil: 1 }) // for cleanup of expired coupons
