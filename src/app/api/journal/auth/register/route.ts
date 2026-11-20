import { NextResponse } from "next/server";
import { createJournalUser, getJournalUserByEmail } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !email.includes("@")) {
      return jsonResponse({ error: "A valid email address is required" }, 400);
    }
    if (!password || password.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters long" }, 400);
    }
    if (!full_name || !full_name.trim()) {
      return jsonResponse({ error: "Full name is required" }, 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await getJournalUserByEmail(cleanEmail);
    if (existing) {
      return jsonResponse(
        { error: "An account with this email already exists. Please log in." },
        409
      );
    }

    const { hash, salt } = hashPassword(password);
    const user = await createJournalUser({
      email: cleanEmail,
      password_hash: hash,
      salt,
      full_name: full_name.trim(),
    });

    const token = generateToken(user.id, user.email, user.full_name);

    const response = jsonResponse({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      message: "Account created successfully",
    });

    response.cookies.set("journal_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in journal registration:", error);
    return jsonResponse({ error: "Failed to create account" }, 500);
  }
}
