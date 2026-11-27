import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { toggleRegistrationAttendance } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("kws_admin_token");

    if (!adminToken || adminToken.value !== "granted_admin_session") {
      return NextResponse.json(
        { error: "Unauthorized access. Admin login required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, attended } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const updated = await toggleRegistrationAttendance(id, Boolean(attended), "admin");

    if (!updated) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      registration: updated,
      message: attended
        ? `Marked ${updated.full_name} as attended.`
        : `Marked ${updated.full_name} as not checked in.`,
    });
  } catch (error) {
    console.error("Error toggling registration attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance status" },
      { status: 500 }
    );
  }
}
