import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Authentication check failed" }, { status: 500 })
  }
}
