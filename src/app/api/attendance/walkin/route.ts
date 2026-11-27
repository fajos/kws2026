import { NextResponse } from "next/server";
import { createRegistration, getRegistrationByEmail, markRegistrationAttendance } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, attendance_type = "in-person" } = body;

    if (!full_name || !full_name.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let reg = await getRegistrationByEmail(cleanEmail);

    if (!reg) {
      reg = await createRegistration({
        full_name: full_name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        attendance_type: attendance_type === "virtual" ? "virtual" : "in-person",
        occupation: "Event Walk-in",
        city_country: "",
        expectations: "Walk-in check-in",
      });
    }

    if (reg && reg.id) {
      const updated = await markRegistrationAttendance(reg.id, "walk-in");
      return NextResponse.json({
        success: true,
        registration: updated || reg,
        message: `Welcome, ${reg.full_name}! Your registration and attendance have been recorded.`,
      });
    }

    return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 });
  } catch (error) {
    console.error("Error in walk-in check-in route:", error);
    return NextResponse.json(
      { error: "Failed to record walk-in attendance" },
      { status: 500 }
    );
  }
}
