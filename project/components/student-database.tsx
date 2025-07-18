"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Edit, Eye, Download } from "lucide-react"
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
  created_at: string
  risk_level?: string
}

export default function StudentDatabase() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class_grade.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }, [students, searchTerm])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (response.ok) {
        const studentsWithRisk = data.students.map((student: Student) => ({
          ...student,
          risk_level: calculateRiskLevel(student),
        }))
        setStudents(studentsWithRisk)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateRiskLevel = (student: Student): string => {
    let riskScore = 0

    if (student.attendance_rate < 70) riskScore += 3
    else if (student.attendance_rate < 85) riskScore += 1

    if (student.study_hours_per_week < 8) riskScore += 2
    else if (student.study_hours_per_week < 12) riskScore += 1

    if (student.previous_percentage < 60) riskScore += 3
    else if (student.previous_percentage < 70) riskScore += 1

    if (student.health_status === "poor") riskScore += 2
    else if (student.health_status === "fair") riskScore += 1

    if (student.family_support === "low") riskScore += 2

    if (student.current_percentage < 60) riskScore += 3
    else if (student.current_percentage < 70) riskScore += 1

    if (riskScore >= 6) return "high"
    if (riskScore >= 3) return "medium"
    return "low"
  }

  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStudents(students.filter((s) => s.id !== id))
        toast({
          title: "Success",
          description: "Student deleted successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = [
      "student_name",
      "student_id",
      "class_grade",
      "attendance_rate",
      "study_hours_per_week",
      "sleep_duration",
      "health_status",
      "family_support",
      "internet_access",
      "parental_education",
      "previous_percentage",
      "class_participation",
      "extracurricular_activities",
      "current_percentage",
      "risk_level",
    ]

    const csvContent = [
      headers.join(","),
      ...students.map((student) =>
        headers
          .map((header) => {
            const value = student[header as keyof Student]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Student data exported successfully.",
    })
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
      "A+": "bg-green-100 text-green-800",
      A: "bg-green-100 text-green-800",
      "A-": "bg-green-100 text-green-800",
      "B+": "bg-blue-100 text-blue-800",
      B: "bg-blue-100 text-blue-800",
      "B-": "bg-blue-100 text-blue-800",
      "C+": "bg-yellow-100 text-yellow-800",
      C: "bg-yellow-100 text-yellow-800",
      "C-": "bg-yellow-100 text-yellow-800",
      D: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    }

    return <Badge className={gradeColors[grade] || "bg-gray-100 text-gray-800"}>{grade}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Database</CardTitle>
          <CardDescription>Manage and view all student records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            </div>
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Study Hours</TableHead>
                  <TableHead>Previous GPA</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.student_name}</TableCell>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>{getGradeBadge(student.class_grade)}</TableCell>
                    <TableCell>{student.attendance_rate}%</TableCell>
                    <TableCell>{student.study_hours_per_week}h/week</TableCell>
                    <TableCell>{student.previous_percentage?.toFixed(1) || "N/A"}%</TableCell>
                    <TableCell>{getRiskBadge(student.risk_level || "low")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No students found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {students.filter((s) => s.risk_level === "high").length}
              </p>
              <p className="text-sm text-gray-600">High Risk</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter((s) => s.risk_level === "medium").length}
              </p>
              <p className="text-sm text-gray-600">Medium Risk</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.risk_level === "low").length}
              </p>
              <p className="text-sm text-gray-600">Low Risk</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
