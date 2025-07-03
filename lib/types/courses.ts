export interface Instructor {
    name: string
    bio?: string
    avatar?: string
    credentials?: string[]
  }
  
  export interface Pricing {
    type: "free" | "premium" | "one-time"
    amount: number
    currency: string
    originalPrice: number
    discountPrice?: number
    discountPercentage?: number
  }
  
  export interface Stats {
    enrollments: number
    completions: number
    views: number
    totalStudents: number
    totalRatings: number
    averageRating: number
    totalReviews: number
    completionRate: number
    totalDuration: number
    totalConcepts: number
    totalVideos: number
    totalArticles: number
    totalProblems: number
    totalQuizzes: number
  }
  
  export interface Course {
    _id: string
    title: string
    slug: string
    description: string
    shortDescription?: string
    thumbnail: string
    category: string
    subcategory?: string
    level: string
    tags: string[]
    isActive: boolean
    comingSoon: boolean
    instructor: Instructor
    pricing: Pricing
    stats: Stats
    userEnrollment?: {
      enrolled: boolean
      progress: number
      status: string
      lastAccessedAt?: string
    }
    isEnrolled?: boolean // derived in frontend
  }
  
  export interface CourseResponse {
    success: boolean
    data: {
      courses: Course[]
      pagination: {
        current: number
        pages: number
        total: number
      }
    }
  }