import { decomposeGoal, LifeArea } from "@/lib/aiDecompose";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { area, goalText, year, customApiKey, provider } = body;

    if (!area || !goalText || !goalText.trim()) {
      return jsonResponse(
        { error: "Life area and goal description are required" },
        400
      );
    }

    const decomposed = await decomposeGoal(
      area as LifeArea,
      goalText.trim(),
      year ? parseInt(year, 10) : 2026,
      customApiKey,
      provider
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
