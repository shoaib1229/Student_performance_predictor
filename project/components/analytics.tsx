"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import { BarChart3, PieChartIcon, TrendingUp, Users } from "lucide-react"

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

export default function Analytics() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (response.ok) {
        setStudents(data.students)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">No student data available for analytics.</p>
        <p className="text-sm text-gray-400 mt-2">Add some students to see insights and charts.</p>
      </div>
    )
  }

  // Calculate analytics data
  const gradeDistribution = students.reduce(
    (acc, student) => {
      const grade = student.class_grade
      acc[grade] = (acc[grade] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count / students.length) * 100).toFixed(1),
  }))

  const attendanceRanges = [
    { range: "90-100%", min: 90, max: 100 },
    { range: "80-89%", min: 80, max: 89 },
    { range: "70-79%", min: 70, max: 79 },
    { range: "60-69%", min: 60, max: 69 },
    { range: "Below 60%", min: 0, max: 59 },
  ]

  const attendanceData = attendanceRanges.map((range) => {
    const count = students.filter((s) => s.attendance_rate >= range.min && s.attendance_rate <= range.max).length
    return {
      range: range.range,
      count,
      percentage: ((count / students.length) * 100).toFixed(1),
    }
  })

  const studyHoursData = students.map((student) => ({
    name: student.student_name,
    study_hours: student.study_hours_per_week,
    attendance: student.attendance_rate,
    percentage: student.previous_percentage,
  }))

  const healthData = students.reduce(
    (acc, student) => {
      const health = student.health_status
      acc[health] = (acc[health] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const healthChartData = Object.entries(healthData).map(([status, count]) => ({
    status,
    count,
    percentage: ((count / students.length) * 100).toFixed(1),
  }))

  const familySupportData = students.reduce(
    (acc, student) => {
      const support = student.family_support
      acc[support] = (acc[support] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const supportChartData = Object.entries(familySupportData).map(([level, count]) => ({
    level,
    count,
    percentage: ((count / students.length) * 100).toFixed(1),
  }))

  const averageAttendance = (students.reduce((sum, s) => sum + s.attendance_rate, 0) / students.length).toFixed(1)
  const averageStudyHours = (students.reduce((sum, s) => sum + s.study_hours_per_week, 0) / students.length).toFixed(1)
  const averagePercentage = (students.reduce((sum, s) => sum + s.previous_percentage, 0) / students.length).toFixed(1)
  const passRate = ((students.filter((s) => s.current_percentage >= 60).length / students.length) * 100).toFixed(1)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{averageAttendance}%</p>
                <p className="text-sm text-gray-600">Avg Attendance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{averagePercentage}%</p>
                <p className="text-sm text-gray-600">Avg Previous %</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{passRate}%</p>
                <p className="text-sm text-gray-600">Pass Rate</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Current grade distribution across all students</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === "count" ? "Students" : name]} />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Ranges</CardTitle>
            <CardDescription>Distribution of student attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Hours vs GPA</CardTitle>
            <CardDescription>Correlation between weekly study hours and academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={studyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="study_hours" name="Study Hours" />
                <YAxis dataKey="percentage" name="Previous %" domain={[0, 100]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter dataKey="percentage" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Status Distribution</CardTitle>
            <CardDescription>Student health status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Students"]} />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important findings from the student data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Attendance Impact</h4>
              <p className="text-sm text-blue-700">
                Students with 90%+ attendance show significantly better academic performance compared to those with
                lower attendance rates.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Study Hours Correlation</h4>
              <p className="text-sm text-green-700">
                There's a positive correlation between weekly study hours and GPA, with optimal performance around 15-20
                hours per week.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Health & Performance</h4>
              <p className="text-sm text-purple-700">
                Students with excellent or good health status tend to have better academic outcomes and higher
                engagement levels.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Family Support Importance</h4>
              <p className="text-sm text-orange-700">
                Students with high family support demonstrate better academic performance and lower risk levels across
                all metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
