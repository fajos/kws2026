import { getJournalUserByEmail } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonResponse({ error: "Email and password are required" }, 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await getJournalUserByEmail(cleanEmail);
    if (!user) {
      return jsonResponse({ error: "Invalid email or password" }, 401);
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return jsonResponse({ error: "Invalid email or password" }, 401);
    }

    const token = generateToken(user.id, user.email, user.full_name);

    const response = jsonResponse({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      message: "Logged in successfully",
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
    console.error("Error in journal login:", error);
    return jsonResponse({ error: "Login failed" }, 500);
  }
}

export async function DELETE() {
  const response = jsonResponse({ success: true, message: "Logged out successfully" });
  response.cookies.delete("journal_token");
  return response;
}
