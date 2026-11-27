import { getUserFromRequest } from "@/lib/auth";
import {
  getJournalEntry,
  saveJournalEntry,
  getAllJournalYearsForUser,
  isJournalUserPro,
} from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized. Please log in." }, 401);
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const entry = await getJournalEntry(auth.userId, year);
    const availableYears = await getAllJournalYearsForUser(auth.userId);

    let parsedState = null;
    if (entry && entry.data) {
      try {
        parsedState = JSON.parse(entry.data);
      } catch (e) {
        console.error("Failed to parse journal JSON:", e);
      }
    }

    return jsonResponse({
      year,
      state: parsedState,
      availableYears: Array.from(new Set([...availableYears, year])).sort((a, b) => a - b),
      updatedAt: entry?.updated_at || null,
    });
  } catch (error) {
    console.error("Error fetching journal state:", error);
    return jsonResponse({ error: "Failed to fetch journal state" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized. Please log in." }, 401);
    }

    const body = await request.json();
    const { year, state } = body;

    if (!year || !state) {
      return jsonResponse({ error: "Year and state are required" }, 400);
    }

    const dataJson = typeof state === "string" ? state : JSON.stringify(state);
    await saveJournalEntry(auth.userId, parseInt(year, 10), dataJson);

    return jsonResponse({
      success: true,
      message: "Journal state saved successfully to cloud",
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving journal state:", error);
    return jsonResponse({ error: "Failed to save journal state" }, 500);
  }
}
