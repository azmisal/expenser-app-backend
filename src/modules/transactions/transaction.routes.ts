import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

export async function transactionRoutes(app: FastifyInstance) {
  app.post("/transactions", async (request) => {
    const body = request.body as any; // temporary — Zod validation comes next

    const transaction = await prisma.transaction.create({
      data: {
        type: body.type,
        amount: body.amount,
        mySpent: body.mySpent,
        isSplit: body.isSplit ?? false,
        splitType: body.splitType ?? "none",
        category: body.category,
        description: body.description,
      },
    });

    return transaction;
  });
}