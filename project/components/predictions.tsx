"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  student_name: string
  student_id: string
  class_grade: string
  attendance_rate: number
  study_hours_per_week: number
  sleep_duration: number
  health_status: string
  family_support: string
  internet_access: string
  parental_education: string
  previous_percentage: number
  class_participation: string
  extracurricular_activities: string
  current_percentage: number
}

interface PredictionResult {
  predicted_grade: string
  confidence: number
  risk_level: "low" | "medium" | "high"
  recommendations: string[]
  improvement_areas: string[]
  predicted_gpa: number
}

export default function Predictions() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find((s) => s.id === selectedStudentId)
      setSelectedStudent(student || null)
      setPrediction(null)
    }
  }, [selectedStudentId, students])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (response.ok) {
        setStudents(data.students)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students.",
        variant: "destructive",
      })
    }
  }

  const makePrediction = async () => {
    if (!selectedStudent) return

    setIsLoading(true)
    try {
      // Simulate prediction logic based on student data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const prediction = generatePrediction(selectedStudent)
      setPrediction(prediction)

      toast({
        title: "Prediction Complete",
        description: `Performance prediction generated for ${selectedStudent.student_name}`,
      })
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePrediction = (student: Student): PredictionResult => {
    // Calculate prediction based on multiple factors
    let score = 0
    const factors = []

    // Attendance impact (30% weight)
    const attendanceScore = student.attendance_rate * 0.3
    score += attendanceScore
    if (student.attendance_rate < 70) factors.push("Poor attendance")
    else if (student.attendance_rate < 85) factors.push("Below average attendance")

    // Study hours impact (25% weight)
    const studyScore = Math.min(student.study_hours_per_week * 2.5, 25)
    score += studyScore
    if (student.study_hours_per_week < 8) factors.push("Insufficient study time")
    else if (student.study_hours_per_week < 12) factors.push("Below recommended study hours")

    // Previous performance impact (25% weight)
    const prevScore = (student.previous_percentage / 100) * 25
    score += prevScore
    if (student.previous_percentage < 60) factors.push("Poor academic history")
    else if (student.previous_percentage < 70) factors.push("Below average previous performance")

    // Health and lifestyle (10% weight)
    const healthScores = { excellent: 10, good: 7.5, fair: 5, poor: 2.5 }
    score += healthScores[student.health_status as keyof typeof healthScores] || 5
    if (student.health_status === "poor" || student.health_status === "fair") {
      factors.push("Health concerns")
    }

    // Family support (5% weight)
    const supportScores = { high: 5, medium: 3, low: 1 }
    score += supportScores[student.family_support as keyof typeof supportScores] || 3
    if (student.family_support === "low") factors.push("Limited family support")

    // Sleep impact (5% weight)
    const sleepScore = student.sleep_duration >= 7 && student.sleep_duration <= 9 ? 5 : 2.5
    score += sleepScore
    if (student.sleep_duration < 6 || student.sleep_duration > 10) {
      factors.push("Poor sleep habits")
    }

    // Convert score to grade prediction
    let predictedGrade = "F"
    let predictedGPA = 0

    if (score >= 90) {
      predictedGrade = "A"
      predictedGPA = 3.7 + Math.random() * 0.3
    } else if (score >= 80) {
      predictedGrade = "B"
      predictedGPA = 3.0 + Math.random() * 0.7
    } else if (score >= 70) {
      predictedGrade = "C"
      predictedGPA = 2.0 + Math.random() * 1.0
    } else if (score >= 60) {
      predictedGrade = "D"
      predictedGPA = 1.0 + Math.random() * 1.0
    } else {
      predictedGrade = "F"
      predictedGPA = Math.random() * 1.0
    }

    // Calculate risk level
    let riskLevel: "low" | "medium" | "high" = "low"
    if (factors.length >= 3 || score < 60) riskLevel = "high"
    else if (factors.length >= 1 || score < 75) riskLevel = "medium"

    // Generate recommendations
    const recommendations = generateRecommendations(student, factors)
    const improvementAreas = factors.length > 0 ? factors : ["Continue current performance"]

    return {
      predicted_grade: predictedGrade,
      confidence: Math.min(0.95, Math.max(0.65, 0.8 + (score - 70) * 0.003)),
      risk_level: riskLevel,
      recommendations,
      improvement_areas: improvementAreas,
      predicted_gpa: Math.min(4.0, predictedGPA),
    }
  }

  const generateRecommendations = (student: Student, factors: string[]): string[] => {
    const recommendations: string[] = []

    if (student.attendance_rate < 85) {
      recommendations.push("Improve class attendance - aim for 90%+ attendance rate")
    }

    if (student.study_hours_per_week < 12) {
      recommendations.push("Increase study time to 12-15 hours per week for optimal results")
    }

    if (student.sleep_duration < 7) {
      recommendations.push("Get 7-8 hours of sleep nightly for better cognitive performance")
    }

    if (student.health_status === "poor" || student.health_status === "fair") {
      recommendations.push("Focus on physical health through exercise and proper nutrition")
    }

    if (student.family_support === "low") {
      recommendations.push("Seek additional academic support from teachers or tutoring")
    }

    if (student.class_participation === "low") {
      recommendations.push("Increase active participation in class discussions and activities")
    }

    if (student.previous_percentage < 70) {
      recommendations.push("Consider academic counseling to address learning gaps")
    }

    if (student.extracurricular_activities === "none") {
      recommendations.push("Join extracurricular activities for well-rounded development")
    }

    if (recommendations.length === 0) {
      recommendations.push("Maintain current excellent performance and study habits")
    }

    return recommendations
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getGradeBadge = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      A: "bg-green-100 text-green-800",
      B: "bg-blue-100 text-blue-800",
      C: "bg-yellow-100 text-yellow-800",
      D: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    }

    return <Badge className={gradeColors[grade] || "bg-gray-100 text-gray-800"}>{grade}</Badge>
  }

  const getPerformanceIcon = (grade: string) => {
    return ["A", "B"].includes(grade) ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Student
            </CardTitle>
            <CardDescription>Choose a student to predict their academic performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.student_name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStudent && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Current Student Profile</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedStudent.student_name}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {selectedStudent.student_id}
                  </div>
                  <div>
                    <span className="font-medium">Current Grade:</span> {selectedStudent.class_grade}
                  </div>
                  <div>
                    <span className="font-medium">Attendance:</span> {selectedStudent.attendance_rate}%
                  </div>
                  <div>
                    <span className="font-medium">Study Hours:</span> {selectedStudent.study_hours_per_week}h/week
                  </div>
                  <div>
                    <span className="font-medium">Previous %:</span> {selectedStudent.previous_percentage}%
                  </div>
                  <div>
                    <span className="font-medium">Current %:</span> {selectedStudent.current_percentage}%
                  </div>
                  <div>
                    <span className="font-medium">Health:</span> {selectedStudent.health_status}
                  </div>
                  <div>
                    <span className="font-medium">Family Support:</span> {selectedStudent.family_support}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={makePrediction}
              disabled={!selectedStudent || isLoading}
              className="w-full flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              {isLoading ? "Generating Prediction..." : "Predict Performance"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>AI-powered academic performance prediction</CardDescription>
          </CardHeader>
          <CardContent>
            {prediction && selectedStudent ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getPerformanceIcon(prediction.predicted_grade)}
                    <h3 className="text-2xl font-bold">Grade {prediction.predicted_grade}</h3>
                  </div>
                  <p className="text-gray-600">Predicted Performance</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-500">Predicted GPA: {prediction.predicted_gpa.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Risk Level:</span>
                    {getRiskBadge(prediction.risk_level)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Predicted Grade:</span>
                    {getGradeBadge(prediction.predicted_grade)}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {prediction.improvement_areas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a student and click "Predict Performance" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
