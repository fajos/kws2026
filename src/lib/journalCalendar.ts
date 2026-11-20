export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = typeof DAY_KEYS[number];

export interface DayDateInfo {
  dayNumber: number;
  monthShort: string;
  formatted: string;
  isCurrentMonth: boolean;
}

export interface MonthWeekInfo {
  weekIndex: number;
  startDay: number;
  endDay: number;
  label: string;
  shortLabel: string;
  dateRange: string;
  days: Record<DayKey, DayDateInfo>;
}

/**
 * Standard ISO-8601 calendar logic for weekly journal planners:
 * Every week is a full 7-day spread from Monday to Sunday.
 * A week belongs uniquely to the month that contains the majority of its days (where Thursday falls).
 * This ensures no overlapping duplicate weeks and exact calendar counts (either 4 or 5 weeks per month).
 */
export function getWeeksForMonth(year: number, monthIndex: number): MonthWeekInfo[] {
  const weeks: MonthWeekInfo[] = [];

  // Find the Monday of the week that contains the 1st of this month
  const firstOfMonth = new Date(year, monthIndex - 1, 1);
  const firstJsDay = firstOfMonth.getDay();
  // Offset to preceding Monday (0=Sun -> -6, 1=Mon -> 0, etc.)
  const diffToMonday = (firstJsDay === 0 ? -6 : 1) - firstJsDay;
  let monday = new Date(year, monthIndex - 1, 1 + diffToMonday);

  let weekIndex = 1;

  while (true) {
    const thursday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

    const thursdayMonth = thursday.getMonth();
    const thursdayYear = thursday.getFullYear();

    // Check if the majority of this week (Thursday) belongs to this month
    if (thursdayYear === year && thursdayMonth === monthIndex - 1) {
      const monShort = MONTH_NAMES_SHORT[monday.getMonth()];
      const sunShort = MONTH_NAMES_SHORT[sunday.getMonth()];
      const monDay = monday.getDate();
      const sunDay = sunday.getDate();

      const startStr = `${monShort} ${monDay}`;
      const endStr = `${sunShort} ${sunDay}`;
      const shortRange =
        monShort === sunShort ? `${monShort} ${monDay} – ${sunDay}` : `${startStr} – ${endStr}`;

      const daysInfo = {} as Record<DayKey, DayDateInfo>;
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        const isCur = d.getMonth() === monthIndex - 1 && d.getFullYear() === year;
        daysInfo[DAY_KEYS[i]] = {
          dayNumber: d.getDate(),
          monthShort: MONTH_NAMES_SHORT[d.getMonth()],
          formatted: `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getDate()}`,
          isCurrentMonth: isCur,
        };
      }

      weeks.push({
        weekIndex,
        startDay: monDay,
        endDay: sunDay,
        label: `Week ${weekIndex} (${shortRange})`,
        shortLabel: shortRange,
        dateRange: `${shortRange}, ${thursdayYear}`,
        days: daysInfo,
      });

      weekIndex++;
    } else if (
      thursdayYear > year ||
      (thursdayYear === year && thursdayMonth > monthIndex - 1)
    ) {
      // Past all weeks assigned to this month
      break;
    }

    // Move to next Monday
    monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
  }

  return weeks;
}
