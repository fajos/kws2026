import { NextResponse } from "next/server";
import { findRegistrationForAttendance, markRegistrationAttendance } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, action = "checkin", method = "self" } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { error: "Please enter your email address or phone number" },
        { status: 400 }
      );
    }

    const reg = await findRegistrationForAttendance(identifier);

    if (!reg || !reg.id) {
      return NextResponse.json(
        {
          success: false,
          notFound: true,
          message: "No existing registration found with this email or phone number.",
        },
        { status: 404 }
      );
    }

    const wasAlreadyCheckedIn = Boolean(reg.attended);

    // If action is "lookup", just return details so user can preview before checking in
    if (action === "lookup") {
      return NextResponse.json({
        success: true,
        registration: reg,
        alreadyCheckedIn: wasAlreadyCheckedIn,
      });
    }

    // Default action: "checkin"
    const updated = await markRegistrationAttendance(reg.id, method);

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: wasAlreadyCheckedIn,
      registration: updated || reg,
      message: wasAlreadyCheckedIn
        ? `Welcome back, ${reg.full_name}! You are already checked in.`
        : `Check-in successful! Welcome, ${reg.full_name}!`,
    });
  } catch (error) {
    console.error("Error in attendance check-in route:", error);
    return NextResponse.json(
      { error: "An error occurred while marking attendance. Please try again." },
      { status: 500 }
    );
  }
}
