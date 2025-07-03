"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, FileText, Video, Code, BookOpen, ArrowLeft, Trophy, Target, Zap, Loader2 } from "lucide-react"
import Link from "next/link"
import { VideoPlayer } from "@/components/video-player"
import { ArticleReader } from "@/components/article-reader"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

interface Topic {
  id: number
  title: string
  type: string
  duration: string
  videoUrl?: string
  thumbnail?: string
  content?: any
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
  thumbnail: string
  category: string
  instructor: {
    name: string
  }
}

interface ConceptProgress {
  conceptId: number
  completed: boolean
  progress: number
  topicsProgress: Array<{
    topicId: number
    completed: boolean
    timeSpent: number
  }>
}

interface UserProgress {
  overallProgress: number
  conceptsProgress: ConceptProgress[]
}

export default function ConceptPage({ params }: { params: { id: string; conceptId: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [concept, setConcept] = useState<Concept | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("videos")
  const [updatingProgress, setUpdatingProgress] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("topic")

  useEffect(() => {
    fetchConceptData()
  }, [params.id, params.conceptId])

  useEffect(() => {
    if (concept && topicId) {
      const topic = concept.topics.find((t) => t.id.toString() === topicId)
      if (topic) {
        setActiveTab(getTabForTopicType(topic.type))
      }
    }
  }, [concept, topicId])

  const fetchConceptData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Fetch course data
      const courseResponse = await fetch(`/api/courses/${params.id}`, { headers })
      if (!courseResponse.ok) throw new Error("Failed to fetch course")

      const courseData = await courseResponse.json()
      setCourse(courseData.data.course)
      setUserProgress(courseData.data.userProgress)

      // Find the specific concept
      const foundConcept = courseData.data.course.concepts.find((c: Concept) => c.id.toString() === params.conceptId)

      if (!foundConcept) {
        throw new Error("Concept not found")
      }

      // Merge concept data with progress data
      const conceptProgress = courseData.data.userProgress?.conceptsProgress.find(
        (cp: ConceptProgress) => cp.conceptId.toString() === params.conceptId,
      )

      const conceptWithProgress = {
        ...foundConcept,
        topics: foundConcept.topics.map((topic: Topic) => {
          const topicProgress = conceptProgress?.topicsProgress.find((tp) => tp.topicId === topic.id)
          return {
            ...topic,
            completed: topicProgress?.completed || false,
          }
        }),
      }

      setConcept(conceptWithProgress)

      // Set active tab based on progress - go to first incomplete section
      const videosCompleted = conceptWithProgress.topics.filter((t: Topic) => t.type === "video" && t.completed).length
      const totalVideos = conceptWithProgress.topics.filter((t: Topic) => t.type === "video").length
      const articlesCompleted = conceptWithProgress.topics.filter(
        (t: Topic) => t.type === "article" && t.completed,
      ).length
      const totalArticles = conceptWithProgress.topics.filter((t: Topic) => t.type === "article").length
      const problemsCompleted = conceptWithProgress.topics.filter(
        (t: Topic) => t.type === "coding" && t.completed,
      ).length
      const totalProblems = conceptWithProgress.topics.filter((t: Topic) => t.type === "coding").length
      const quizzesCompleted = conceptWithProgress.topics.filter((t: Topic) => t.type === "quiz" && t.completed).length
      const totalQuizzes = conceptWithProgress.topics.filter((t: Topic) => t.type === "quiz").length

      if (videosCompleted < totalVideos) {
        setActiveTab("videos")
      } else if (articlesCompleted < totalArticles) {
        setActiveTab("articles")
      } else if (problemsCompleted < totalProblems) {
        setActiveTab("problems")
      } else if (quizzesCompleted < totalQuizzes) {
        setActiveTab("quiz")
      }
    } catch (error) {
      console.error("Error fetching concept data:", error)
      toast({
        title: "Error",
        description: "Failed to load concept. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTabForTopicType = (type: string) => {
    switch (type) {
      case "video":
        return "videos"
      case "article":
        return "articles"
      case "coding":
        return "problems"
      case "quiz":
        return "quiz"
      default:
        return "videos"
    }
  }

  const updateTopicProgress = async (topicId: number, completed: boolean, timeSpent?: number) => {
    try {
      setUpdatingProgress(true)
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to track progress.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `/api/courses/${params.id}/concepts/${params.conceptId}/topics/${topicId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              completed,
              timeSpent: timeSpent || 0,
            },
          }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update progress")
      }

      // Update local state
      setConcept((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          topics: prev.topics.map((topic) => (topic.id === topicId ? { ...topic, completed } : topic)),
        }
      })

      // Refresh progress data
      await fetchConceptData()

      toast({
        title: "Progress Updated",
        description: completed ? "Topic marked as complete!" : "Progress saved.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress.",
        variant: "destructive",
      })
    } finally {
      setUpdatingProgress(false)
    }
  }

  const getMasteryColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
    if (score >= 60) return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
    if (score >= 40) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
    return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300"
  }

  const getMasteryIcon = (score: number) => {
    if (score >= 80) return <Trophy className="w-4 h-4" />
    if (score >= 60) return <CheckCircle className="w-4 h-4" />
    if (score >= 40) return <Target className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const getConceptProgress = () => {
    if (!concept || !userProgress) return 0
    const conceptProgress = userProgress.conceptsProgress.find((cp) => cp.conceptId.toString() === params.conceptId)
    return conceptProgress?.progress || 0
  }

  const getTopicsByType = (type: string) => {
    if (!concept) return []
    return concept.topics.filter((topic) => topic.type === type)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!concept || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Concept Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The concept you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href={`/courses/${params.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const conceptProgress = getConceptProgress()
  const videosCompleted = concept.topics.filter((t) => t.type === "video" && t.completed).length
  const totalVideos = concept.topics.filter((t) => t.type === "video").length
  const articlesCompleted = concept.topics.filter((t) => t.type === "article" && t.completed).length
  const totalArticles = concept.topics.filter((t) => t.type === "article").length
  const problemsCompleted = concept.topics.filter((t) => t.type === "coding" && t.completed).length
  const totalProblems = concept.topics.filter((t) => t.type === "coding").length
  const quizzesCompleted = concept.topics.filter((t) => t.type === "quiz" && t.completed).length
  const totalQuizzes = concept.topics.filter((t) => t.type === "quiz").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Link href={`/courses/${params.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
              {course.title}
            </Link>
            <span>•</span>
            <span>{concept.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{concept.title}</h1>
              <p className="text-muted-foreground">{concept.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className={`${getMasteryColor(conceptProgress)} border-0`}>
                {getMasteryIcon(conceptProgress)}
                <span className="ml-1">Progress: {Math.round(conceptProgress)}%</span>
              </Badge>
              <Button variant="outline" asChild>
                <Link href={`/courses/${params.id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6 dark:bg-gray-800/80 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Videos</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {videosCompleted}/{totalVideos}
                </div>
                <Progress value={totalVideos > 0 ? (videosCompleted / totalVideos) * 100 : 0} className="h-2 mt-2" />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Articles</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articlesCompleted}/{totalArticles}
                </div>
                <Progress
                  value={totalArticles > 0 ? (articlesCompleted / totalArticles) * 100 : 0}
                  className="h-2 mt-2"
                />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Code className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Problems</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problemsCompleted}/{totalProblems}
                </div>
                <Progress
                  value={totalProblems > 0 ? (problemsCompleted / totalProblems) * 100 : 0}
                  className="h-2 mt-2"
                />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Quizzes</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quizzesCompleted}/{totalQuizzes}
                </div>
                <Progress value={totalQuizzes > 0 ? (quizzesCompleted / totalQuizzes) * 100 : 0} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>
                Videos ({videosCompleted}/{totalVideos})
              </span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>
                Articles ({articlesCompleted}/{totalArticles})
              </span>
            </TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>
                Problems ({problemsCompleted}/{totalProblems})
              </span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>
                Quizzes ({quizzesCompleted}/{totalQuizzes})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <VideoPlayer
              videos={getTopicsByType("video").map((topic) => ({
                id: topic.id,
                title: topic.title,
                duration: topic.duration,
                thumbnail: topic.thumbnail || "/placeholder.svg?height=180&width=320",
                url: topic.videoUrl || "",
                watched: topic.completed,
                watchTime: topic.completed ? 100 : 0,
                totalTime: 100,
              }))}
              onVideoComplete={(videoId, watchTime) => updateTopicProgress(videoId, true, Math.round(watchTime / 60))}
            />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleReader
              articles={getTopicsByType("article").map((topic) => ({
                id: topic.id,
                title: topic.title,
                readTime: topic.duration,
                content:
                  topic.content?.articleContent ||
                  `# ${topic.title}\n\nContent for ${topic.title} will be available soon.`,
                read: topic.completed,
              }))}
              onArticleComplete={(articleId) => updateTopicProgress(articleId, true, 5)}
            />
          </TabsContent>

          <TabsContent value="problems">
            <div className="space-y-4">
              {getTopicsByType("coding").map((problem, index) => (
                <Card key={problem.id} className="dark:bg-gray-800/80 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {index + 1}. {problem.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            Easy
                          </Badge>
                          {problem.completed && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <Trophy className="w-3 h-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!problem.completed && (
                          <Button
                            size="sm"
                            onClick={() => updateTopicProgress(problem.id, true, 15)}
                            disabled={updatingProgress}
                          >
                            {updatingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Complete"}
                          </Button>
                        )}
                        <Button asChild>
                          <Link
                            href={`/coding-platform?problem=${problem.id}&source=concept&courseId=${params.id}&conceptId=${params.conceptId}&returnUrl=${encodeURIComponent(`/courses/${params.id}/concepts/${params.conceptId}`)}`}
                          >
                            <Code className="w-4 h-4 mr-2" />
                            Solve Problem
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Practice coding problem: {problem.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Estimated time: {problem.duration}</span>
                      <span>Points: 10</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <div className="space-y-4">
              {getTopicsByType("quiz").map((quiz) => (
                <Card key={quiz.id} className="dark:bg-gray-800/80 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">{quiz.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">Quiz</Badge>
                          {quiz.completed && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!quiz.completed && (
                          <Button
                            size="sm"
                            onClick={() => updateTopicProgress(quiz.id, true, 10)}
                            disabled={updatingProgress}
                          >
                            {updatingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Complete"}
                          </Button>
                        )}
                        <Button asChild>
                          <Link
                            href={`/quiz-platform?quiz=${quiz.id}&source=concept&courseId=${params.id}&conceptId=${params.conceptId}`}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Take Quiz
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Test your knowledge with this quiz on {concept.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Duration: {quiz.duration}</span>
                      <span>Questions: 5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
