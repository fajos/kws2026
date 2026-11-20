import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminJournalMembers, getJournalAdminStats } from "@/lib/adminJournal";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("kws_admin_token");

    if (!adminToken || adminToken.value !== "granted_admin_session") {
      return NextResponse.json(
        { error: "Unauthorized access. Admin login required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const filter = searchParams.get("filter") || undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    const exportFormat = searchParams.get("export");

    const members = await getAdminJournalMembers(year, search, filter);
    const stats = await getJournalAdminStats(year);

    if (exportFormat === "csv") {
      const headers = [
        "Member ID",
        "Full Name",
        "Email",
        "Target Year",
        "Total Goals Set",
        "Top 3 Goals",
        "Email Reminders",
        "Reminder Schedule",
        "Last Journal Update",
        "Registered On",
      ];

      const csvRows = [
        headers.join(","),
        ...members.map((m) => {
          const topGoalsSummary = m.top_three_goals
            .map((g) => `[${g.area}] ${g.text}`)
            .join(" | ");

          return [
            `"${m.id}"`,
            `"${(m.full_name || "").replace(/"/g, '""')}"`,
            `"${(m.email || "").replace(/"/g, '""')}"`,
            `"${m.entry_year || year}"`,
            `"${m.total_goals_count}"`,
            `"${topGoalsSummary.replace(/"/g, '""')}"`,
            `"${m.reminder_frequency}"`,
            `"${m.reminder_day || "N/A"}"`,
            `"${m.entry_updated_at || "Never"}"`,
            `"${m.created_at || ""}"`,
          ].join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=kws_journal_goals_${year}.csv`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      year,
      stats,
      members,
    });
  } catch (error) {
    console.error("Error fetching admin journal goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal members and goals" },
      { status: 500 }
    );
  }
}
