import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Predefined admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  id: "admin-001",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Set authentication cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", ADMIN_CREDENTIALS.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: ADMIN_CREDENTIALS.id, username: ADMIN_CREDENTIALS.username },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
