import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Check authentication middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")
  return !!authToken
}

// Import the students array from the main route
const students: any[] = []

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const { csvData } = await request.json()

    if (!csvData || !csvData.trim()) {
      return NextResponse.json({ success: false, message: "CSV data is required" }, { status: 400 })
    }

    // Parse CSV data
    const lines = csvData.trim().split("\n")
    if (lines.length < 2) {
      return NextResponse.json({ success: false, message: "CSV must contain header and data rows" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h: string) => h.trim())
    const requiredHeaders = [
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
    ]

    // Validate headers
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required headers: ${missingHeaders.join(", ")}` },
        { status: 400 },
      )
    }

    const newStudents = []
    const errors = []

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v: string) => v.trim().replace(/"/g, ""))
        const student: any = {}

        headers.forEach((header: string, index: number) => {
          const value = values[index]

          // Convert numeric fields
          if (
            [
              "attendance_rate",
              "study_hours_per_week",
              "sleep_duration",
              "previous_percentage",
              "current_percentage",
            ].includes(header)
          ) {
            student[header] = Number.parseFloat(value) || 0
          } else {
            student[header] = value || ""
          }
        })

        // Validate required fields
        if (!student.student_name || !student.student_id) {
          errors.push(`Row ${i + 1}: Missing student name or ID`)
          continue
        }

        // Check for duplicate student ID
        const existingStudent = students.find((s) => s.student_id === student.student_id)
        if (existingStudent) {
          errors.push(`Row ${i + 1}: Student ID ${student.student_id} already exists`)
          continue
        }

        // Add metadata
        student.id = Date.now().toString() + i
        student.created_at = new Date().toISOString()

        newStudents.push(student)
      } catch (error) {
        errors.push(`Row ${i + 1}: Invalid data format`)
      }
    }

    // Add valid students to the array
    students.push(...newStudents)

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${newStudents.length} students`,
      count: newStudents.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to process CSV data" }, { status: 500 })
  }
}
