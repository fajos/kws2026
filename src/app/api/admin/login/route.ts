import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ADMIN_PASSCODE = (process.env.ADMIN_PASSCODE || "kws2026admin").trim();

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (!passcode || passcode.trim() !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Access denied." },
        { status: 401 }
      );
    }

    // Set HTTP-Only Cookie for 24 hours
    const response = NextResponse.json(
      { success: true, message: "Admin access granted" },
      { status: 200 }
    );

    response.cookies.set("kws_admin_token", "granted_admin_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in admin login route:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.delete("kws_admin_token");
  return response;
}
