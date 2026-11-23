import { getUserFromRequest } from "@/lib/auth";
import { isJournalUserPro } from "@/lib/db";
import { decomposeGoal, LifeArea } from "@/lib/aiDecompose";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse(
        {
          error: "Authentication required. Please sign in to access AI Goal Decomposition.",
          requires_auth: true,
        },
        401
      );
    }

    const isPro = await isJournalUserPro(auth.userId, auth.email);
    if (!isPro) {
      return jsonResponse(
        {
          error: "AI Goal Decomposition requires an active FRA Journal Pro subscription.",
          requires_pro: true,
        },
        403
      );
    }

    const body = await request.json();
    const { area, goalText, year } = body;

    if (!area || !goalText || !goalText.trim()) {
      return jsonResponse(
        { error: "Life area and goal description are required" },
        400
      );
    }

    const decomposed = await decomposeGoal(
      area as LifeArea,
      goalText.trim(),
      year ? parseInt(year, 10) : 2026
    );

    return jsonResponse({
      success: true,
      area,
      goalText,
      plan: decomposed,
    });
  } catch (error) {
    console.error("Error in AI decomposition route:", error);
    return jsonResponse(
      { error: "Failed to generate intelligent breakdown" },
      500
    );
  }
}
