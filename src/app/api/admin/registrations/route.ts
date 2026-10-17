import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllRegistrations, getStats } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Verify admin authentication via cookie
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
    const filterType = searchParams.get("type") || undefined;
    const exportFormat = searchParams.get("export");

    const registrations = await getAllRegistrations(search, filterType);
    const stats = await getStats();

    if (exportFormat === "csv") {
      const headers = [
        "Reference Code",
        "Full Name",
        "Email",
        "Phone",
        "Occupation",
        "Location",
        "Attendance Type",
        "Expectations",
        "Date Registered",
      ];
      const csvRows = [
        headers.join(","),
        ...registrations.map((r) =>
          [
            `"${r.reference_code}"`,
            `"${(r.full_name || "").replace(/"/g, '""')}"`,
            `"${(r.email || "").replace(/"/g, '""')}"`,
            `"${(r.phone || "").replace(/"/g, '""')}"`,
            `"${(r.occupation || "").replace(/"/g, '""')}"`,
            `"${(r.city_country || "").replace(/"/g, '""')}"`,
            `"${r.attendance_type}"`,
            `"${(r.expectations || "").replace(/"/g, '""')}"`,
            `"${r.created_at || ""}"`,
          ].join(",")
        ),
      ];

      const csvString = csvRows.join("\n");
      return new Response(csvString, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="kws2026_registrations.csv"',
        },
      });
    }

    return NextResponse.json({
      registrations,
      stats,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
