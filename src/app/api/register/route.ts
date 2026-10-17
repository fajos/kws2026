import { NextResponse } from "next/server";
import { createRegistration, getRegistrationByEmail } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      occupation,
      city_country,
      attendance_type,
      expectations,
    } = body;

    // Validation
    if (!full_name || !full_name.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (
      !attendance_type ||
      (attendance_type !== "in-person" && attendance_type !== "virtual")
    ) {
      return NextResponse.json(
        { error: "Please select an attendance type" },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await getRegistrationByEmail(email.trim().toLowerCase());
    if (existing) {
      return NextResponse.json(
        {
          message: "You are already registered for KWS 2026!",
          registration: existing,
          alreadyRegistered: true,
        },
        { status: 200 }
      );
    }

    // Create registration
    const registration = await createRegistration({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      occupation: occupation?.trim() || "",
      city_country: city_country?.trim() || "",
      attendance_type,
      expectations: expectations?.trim() || "",
    });

    return NextResponse.json(
      {
        message: "Registration successful!",
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration endpoint:", error);
    return NextResponse.json(
      { error: "Failed to process registration. Please try again." },
      { status: 500 }
    );
  }
}
