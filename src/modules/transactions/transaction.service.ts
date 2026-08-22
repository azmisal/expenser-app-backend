import { CreateTransactionInput } from "./transaction.schema";

interface ResolvedSplit {
  name: string;
  amount: number;
}

interface ComputedTransaction {
  amount: number;
  mySpent: number;
  splits: ResolvedSplit[];
}

export function computeTransaction(input: CreateTransactionInput): ComputedTransaction {
  // Case 1: no split — you paid, you spent the whole amount
  if (input.splitType === "none") {
    return {
      amount: input.amount!,
      mySpent: input.amount!,
      splits: [],
    };
  }

  // Case 2: equal split — divide amount evenly across people (must include "self")
  if (input.splitType === "equal") {
    if (!input.people.includes("self")) {
      throw new Error("Equal split must include 'self' in people list");
    }
    const share = input.amount! / input.people.length;
    return {
      amount: input.amount!,
      mySpent: share,
      splits: input.people.map((name) => ({ name, amount: share })),
    };
  }

  // Case 3: custom split — resolve amount vs percentage per person
  if (input.splitType === "custom") {
    const splits = input.splits!;
    const hasPercentages = splits.some((s) => s.valueType === "percentage");
    const hasAmounts = splits.some((s) => s.valueType === "amount");

    if (hasPercentages && hasAmounts) {
      throw new Error("Cannot mix percentage and amount split types in one transaction");
    }

    let resolvedSplits: ResolvedSplit[];
    let totalAmount: number;

    if (hasAmounts) {
      // Direct amounts: sum them to get the total
      resolvedSplits = splits.map((s) => ({ name: s.name, amount: s.value }));
      totalAmount = resolvedSplits.reduce((sum, s) => sum + s.amount, 0);
    } else {
      // Percentages: require a stated total amount to convert against
      if (input.amount === undefined) {
        throw new Error("Percentage-based splits require a total amount");
      }
      const totalPercentage = splits.reduce((sum, s) => sum + s.value, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error("Percentages must sum to 100");
      }
      totalAmount = input.amount;
      resolvedSplits = splits.map((s) => ({
        name: s.name,
        amount: (s.value / 100) * totalAmount,
      }));
    }

    const selfSplit = resolvedSplits.find((s) => s.name === "self");
    if (!selfSplit) {
      throw new Error("Custom split must include 'self'");
    }

    return {
      amount: totalAmount,
      mySpent: selfSplit.amount,
      splits: resolvedSplits,
    };
  }

  throw new Error("Unknown splitType");
}