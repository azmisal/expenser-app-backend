import { z } from "zod";
import { categoryEnum } from "../catogories/categories.schema";

const splitPersonSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
  valueType: z.enum(["amount", "percentage"]),
});

export const createTransactionSchema = z
  .object({
    type: z.literal("spent"),
    amount: z.number().positive().optional(), // optional: can be derived from splits if not stated
    isSplit: z.boolean(),
    splitType: z.enum(["none", "equal", "custom"]),
    people: z.array(z.string()).default([]), // used for equal split
    splits: z.array(splitPersonSchema).optional(), // used for custom split
    category: categoryEnum,
    description: z.string().min(1),
  })
  .refine(
    (data) => {
      if (data.splitType === "custom") {
        return !!data.splits && data.splits.length > 0;
      }
      if (data.splitType === "none" || data.splitType === "equal") {
        return data.amount !== undefined;
      }
      return true;
    },
    { message: "Missing required fields for the given splitType" }
  );

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;