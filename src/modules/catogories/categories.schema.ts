import { z } from "zod";



export const categoryEnum = z.enum([
  "food",
  "transport",
  "shopping",
  "bills",
  "travel",
  "entertainment",
  "health",
  "other",
]);