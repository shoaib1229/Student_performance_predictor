import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Check authentication middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")
  return !!authToken
}

// In-memory storage with realistic sample data
const students: any[] = [
  {
    id: "1",
    student_name: "Aarav Sharma",
    student_id: "STU2024001",
    class_grade: "10th",
    attendance_rate: 92,
    study_hours_per_week: 18,
    sleep_duration: 7.5,
    health_status: "excellent",
    family_support: "high",
    internet_access: "yes",
    parental_education: "higher",
    previous_percentage: 88,
    class_participation: "high",
    extracurricular_activities: "high",
    current_percentage: 90,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    student_name: "Priya Patel",
    student_id: "STU2024002",
    class_grade: "10th",
    attendance_rate: 78,
    study_hours_per_week: 12,
    sleep_duration: 6.5,
    health_status: "good",
    family_support: "medium",
    internet_access: "yes",
    parental_education: "secondary",
    previous_percentage: 72,
    class_participation: "medium",
    extracurricular_activities: "medium",
    current_percentage: 75,
    created_at: "2024-01-16T11:30:00Z",
  },
  {
    id: "3",
    student_name: "Rohit Kumar",
    student_id: "STU2024003",
    class_grade: "9th",
    attendance_rate: 65,
    study_hours_per_week: 8,
    sleep_duration: 6,
    health_status: "fair",
    family_support: "low",
    internet_access: "no",
    parental_education: "primary",
    previous_percentage: 58,
    class_participation: "low",
    extracurricular_activities: "low",
    current_percentage: 62,
    created_at: "2024-01-17T09:15:00Z",
  },
]

export async function GET() {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      students: students,
      count: students.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const studentData = await request.json()

    // Validate required fields
    if (!studentData.student_name || !studentData.student_id) {
      return NextResponse.json({ success: false, message: "Student name and ID are required" }, { status: 400 })
    }

    // Check for duplicate student ID
    const existingStudent = students.find((s) => s.student_id === studentData.student_id)
    if (existingStudent) {
      return NextResponse.json({ success: false, message: "Student ID already exists" }, { status: 400 })
    }

    // Create new student with ID
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      created_at: new Date().toISOString(),
    }

    students.push(newStudent)

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student: newStudent,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add student" }, { status: 500 })
  }
}
