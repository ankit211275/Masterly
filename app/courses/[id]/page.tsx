"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  CheckCircle,
  Clock,
  Users,
  Star,
  BookOpen,
  FileText,
  Video,
  Code,
  Share,
  Heart,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Trophy,
  Target,
  Brain,
  Award,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Topic {
  id: number
  title: string
  type: string
  duration: string
  completed: boolean
}

interface Concept {
  id: number
  title: string
  description: string
  duration: string
  topics: Topic[]
  completed: boolean
}

interface Course {
  _id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  category: string
  level: string
  duration: string
  instructor: {
    name: string
    bio: string
    avatar: string
  }
  stats: {
    enrollments: number
    averageRating: number
    totalRatings: number
  }
  concepts: Concept[]
  totalConcepts: number
  totalTopics: number
  tags: string[]
  userEnrollment?: {
    enrolled: boolean
    progress: number
    status: string
  }
}

interface UserProgress {
  overallProgress: number
  conceptsProgress: Array<{
    conceptId: number
    completed: boolean
    progress: number
    topicsProgress: Array<{
      topicId: number
      completed: boolean
      timeSpent: number
    }>
  }>
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<number[]>([])
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourseData()
  }, [params.id])

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`/api/courses/${params.id}`, { headers })

      if (!response.ok) {
        throw new Error("Failed to fetch course")
      }

      const data = await response.json()
      setCourse(data.data.course)
      setUserProgress(data.data.userProgress)

      // Auto-expand first concept if enrolled
      if (data.data.course.userEnrollment?.enrolled && data.data.course.concepts.length > 0) {
        setExpandedTopics([data.data.course.concepts[0].id])
        setSelectedConcept(data.data.course.concepts[0])
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      toast({
        title: "Error",
        description: "Failed to load course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to enroll in courses.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/courses/${params.id}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to enroll")
      }

      // Refresh course data to get updated enrollment status
      await fetchCourseData()

      toast({
        title: "Success!",
        description: "You have successfully enrolled in the course.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course.",
        variant: "destructive",
      })
    } finally {
      setEnrolling(false)
    }
  }

  const toggleTopic = (conceptId: number) => {
    setExpandedTopics((prev) =>
      prev.includes(conceptId) ? prev.filter((id) => id !== conceptId) : [...prev, conceptId],
    )
  }

  const getMasteryColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
    if (score >= 60) return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
    if (score >= 40) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
    if (score > 0) return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300"
    return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
  }

  const getMasteryLabel = (score: number) => {
    if (score >= 80) return "Mastered"
    if (score >= 60) return "Completed"
    if (score >= 40) return "In Progress"
    if (score > 0) return "Started"
    return "Not Started"
  }

  const getMasteryIcon = (score: number) => {
    if (score >= 80) return <Trophy className="w-4 h-4" />
    if (score >= 60) return <CheckCircle className="w-4 h-4" />
    if (score >= 40) return <Target className="w-4 h-4" />
    if (score > 0) return <Play className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 40) return "bg-yellow-500"
    if (score > 0) return "bg-orange-500"
    return "bg-gray-300"
  }

  const getConceptProgress = (conceptId: number) => {
    if (!userProgress) return 0
    const conceptProgress = userProgress.conceptsProgress.find((cp) => cp.conceptId === conceptId)
    return conceptProgress?.progress || 0
  }

  const getTopicCompletion = (conceptId: number, topicId: number) => {
    if (!userProgress) return false
    const conceptProgress = userProgress.conceptsProgress.find((cp) => cp.conceptId === conceptId)
    const topicProgress = conceptProgress?.topicsProgress.find((tp) => tp.topicId === topicId)
    return topicProgress?.completed || false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The course you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/courses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const overallProgress = userProgress?.overallProgress || 0
  const completedConcepts = course.concepts.filter((concept) => getConceptProgress(concept.id) >= 100).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="grid lg:grid-cols-4 gap-6 p-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Course Header */}
          <Card className="dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge>{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-white">{course.title}</CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    {course.description}
                  </CardDescription>

                  <div className="flex items-center space-x-6 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.stats.enrollments.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {course.stats.averageRating.toFixed(1)} ({course.stats.totalRatings} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {course.userEnrollment?.enrolled && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}% Complete</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {completedConcepts} of {course.totalConcepts} concepts completed
                    </span>
                    <span>Progress Score: {(overallProgress / 10).toFixed(1)}/10</span>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Enrollment Action */}
          {!course.userEnrollment?.enrolled && (
            <Card className="dark:bg-gray-800/80 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Ready to start learning?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Enroll now to access all course content and track your progress.
                </p>
                <Button onClick={handleEnroll} disabled={enrolling} className="bg-blue-600 hover:bg-blue-700">
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Course Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Content</h2>
              <Badge variant="outline">{course.totalConcepts} Concepts</Badge>
            </div>

            {course.concepts.map((concept) => {
              const conceptProgress = getConceptProgress(concept.id)
              const completedTopics = concept.topics.filter((topic) => getTopicCompletion(concept.id, topic.id)).length

              return (
                <Card key={concept.id} className="dark:bg-gray-800/80 dark:border-gray-700 overflow-hidden">
                  <div className="cursor-pointer" onClick={() => toggleTopic(concept.id)}>
                    <CardHeader className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${getMasteryColor(conceptProgress)}`}>
                            <Brain className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-lg text-gray-900 dark:text-white">{concept.title}</CardTitle>
                              <Badge className={`${getMasteryColor(conceptProgress)} border-0`}>
                                {getMasteryIcon(conceptProgress)}
                                <span className="ml-1">{getMasteryLabel(conceptProgress)}</span>
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                              {concept.description}
                            </CardDescription>
                            <div className="flex items-center space-x-6 mt-3 text-sm text-muted-foreground">
                              <span>
                                {completedTopics}/{concept.topics.length} topics
                              </span>
                              <span>{concept.duration}</span>
                              <span>Progress: {Math.round(conceptProgress)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressColor(conceptProgress)} transition-all duration-300`}
                                style={{ width: `${conceptProgress}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{Math.round(conceptProgress)}%</div>
                          </div>
                          {expandedTopics.includes(concept.id) ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </div>

                  {expandedTopics.includes(concept.id) && (
                    <CardContent className="pt-0">
                      <div className="border-t dark:border-gray-700 pt-4">
                        <div className="grid gap-3">
                          {concept.topics.map((topic) => {
                            const isCompleted = getTopicCompletion(concept.id, topic.id)
                            const topicIcon =
                              topic.type === "video"
                                ? Video
                                : topic.type === "article"
                                  ? FileText
                                  : topic.type === "quiz"
                                    ? BookOpen
                                    : Code

                            return (
                              <div
                                key={topic.id}
                                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer dark:border-gray-700 ${
                                  selectedConcept?.id === concept.id && isCompleted
                                    ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
                                    : ""
                                }`}
                                onClick={() => setSelectedConcept(concept)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`p-2 rounded-lg ${isCompleted ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                  >
                                    {React.createElement(topicIcon, { className: "w-4 h-4" })}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">{topic.title}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <span>{topic.duration}</span>
                                      <span>•</span>
                                      <span className="capitalize">{topic.type}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {isCompleted && (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Complete
                                    </Badge>
                                  )}
                                  {course.userEnrollment?.enrolled && (
                                    <Button size="sm" asChild>
                                      <Link href={`/courses/${params.id}/concepts/${concept.id}?topic=${topic.id}`}>
                                        {isCompleted ? "Review" : "Start"}
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Concept Details */}
          {selectedConcept && course.userEnrollment?.enrolled && (
            <Card className="dark:bg-gray-800/80 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Current Focus</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{selectedConcept.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {getConceptProgress(selectedConcept.id).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">Progress</div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(getConceptProgress(selectedConcept.id))} transition-all duration-500`}
                      style={{ width: `${getConceptProgress(selectedConcept.id)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedConcept.topics.map((topic) => {
                    const isCompleted = getTopicCompletion(selectedConcept.id, topic.id)
                    const topicIcon =
                      topic.type === "video"
                        ? Video
                        : topic.type === "article"
                          ? FileText
                          : topic.type === "quiz"
                            ? BookOpen
                            : Code

                    return (
                      <div key={topic.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          {React.createElement(topicIcon, { className: "w-4 h-4 text-blue-500" })}
                          <span>{topic.title}</span>
                        </span>
                        <span className="font-medium">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 border-t dark:border-gray-700">
                  <Button className="w-full" size="sm" asChild>
                    <Link href={`/courses/${params.id}/concepts/${selectedConcept.id}`}>Continue Learning</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Stats */}
          <Card className="dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Course Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedConcepts}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {course.totalConcepts - completedConcepts}
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>

              {course.userEnrollment?.enrolled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              )}

              <div className="text-center pt-2">
                <Badge className={`${getMasteryColor(overallProgress)} border-0`}>
                  {getMasteryIcon(overallProgress)}
                  <span className="ml-1">{getMasteryLabel(overallProgress)}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Practice Problems
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Watch Next Video
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Award className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
