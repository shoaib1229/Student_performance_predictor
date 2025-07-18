import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (same as main route)
const students: any[] = []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const studentIndex = students.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 })
    }

    students.splice(studentIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updateData = await request.json()

    const studentIndex = students.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 })
    }

    // Update student data
    students[studentIndex] = {
      ...students[studentIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student: students[studentIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update student" }, { status: 500 })
  }
}
