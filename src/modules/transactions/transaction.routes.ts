import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";
import { createTransactionSchema } from "./transaction.schema";
import { computeTransaction } from "./transaction.service";

export async function transactionRoutes(app: FastifyInstance) {
  app.post("/transactions", async (request, reply) => {
    const parseResult = createTransactionSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: parseResult.error.flatten(),
      });
    }

    const input = parseResult.data;

    let computed;
    try {
      computed = computeTransaction(input);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: input.type,
        amount: computed.amount,
        mySpent: computed.mySpent,
        isSplit: input.isSplit,
        splitType: input.splitType,
        category: input.category,
        description: input.description,
        splits: {
          create: computed.splits.map((s) => ({
            name: s.name,
            amount: s.amount,
          })),
        },
      },
    });

    return transaction;
  });
}

