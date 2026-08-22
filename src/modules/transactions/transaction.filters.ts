import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subHours } from "date-fns";

export type Period = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export function getPeriodStart(period: Period, timezone: string): Date {
  const nowUtc = new Date();
  const nowInZone = toZonedTime(nowUtc, timezone);

  let startInZone: Date;

  switch (period) {
    case "hourly":
      startInZone = subHours(nowInZone, 1);
      break;
    case "daily":
      startInZone = startOfDay(nowInZone);
      break;
    case "weekly":
      startInZone = startOfWeek(nowInZone, { weekStartsOn: 0 }); // 0 = Sunday
      break;
    case "monthly":
      startInZone = startOfMonth(nowInZone);
      break;
    case "yearly":
      startInZone = startOfYear(nowInZone);
      break;
  }

  // Convert the zoned boundary back to a true UTC instant for DB comparison
  return fromZonedTime(startInZone, timezone);
}