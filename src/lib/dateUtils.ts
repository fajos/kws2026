/**
 * Date and Time utilities for Kingdom Wealth Summit (KWS 2026).
 * Venue: Eridan Space, The Philippi Centre, Ikeja, Lagos, Nigeria.
 * Timezone: West Africa Time (WAT) = UTC+1 (no DST).
 */

export function getUtcPlus1String(date: Date = new Date()): string {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const watDate = new Date(utcMs + 3600000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = watDate.getFullYear();
  const mm = pad(watDate.getMonth() + 1);
  const dd = pad(watDate.getDate());
  const hh = pad(watDate.getHours());
  const min = pad(watDate.getMinutes());
  const ss = pad(watDate.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * Formats a check-in timestamp into a clean 12-hour display with UTC+1 indication.
 * Example output: "08:49 PM (WAT / UTC+1)"
 */
export function formatUtcPlus1Time(dateStr?: string | null): string {
  if (!dateStr) return "Just now";
  try {
    const trimmed = dateStr.trim();
    // If format is "YYYY-MM-DD HH:MM:SS" (already stored in UTC+1)
    const parts = trimmed.split(" ");
    if (parts.length === 2 && parts[1].includes(":")) {
      const timeParts = parts[1].split(":");
      let hour = parseInt(timeParts[0], 10);
      const min = timeParts[1];
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour.toString().padStart(2, "0")}:${min} ${ampm} (WAT / UTC+1)`;
    }

    // If ISO string
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return dateStr;

    return (
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(d) + " (WAT / UTC+1)"
    );
  } catch {
    return dateStr;
  }
}

/**
 * Formats timestamp as YYYY-MM-DD HH:mm:ss in UTC+1 for CSV export or tables.
 * Example output: "2026-11-28 09:15:32 (UTC+1)"
 */
export function formatUtcPlus1Full(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const trimmed = dateStr.trim();
    if (trimmed.includes("UTC+1")) return trimmed;
    const parts = trimmed.split(" ");
    if (parts.length === 2 && parts[1].includes(":")) {
      return `${trimmed} (UTC+1)`;
    }
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return `${trimmed} (UTC+1)`;

    const watStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(d)
      .replace(",", "");
    return `${watStr} (UTC+1)`;
  } catch {
    return `${dateStr} (UTC+1)`;
  }
}
