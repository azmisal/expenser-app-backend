import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";
import { createTransactionSchema } from "./transaction.schema";
import { computeTransaction } from "./transaction.service";
import { getPeriodStart, Period } from "./transaction.filters";

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


    app.get("/transactions", async (request, reply) => {
        const query = request.query as {
            page?: string;
            limit?: string;
            period?: string;
            timezone?: string;
        };

        const page = parseInt(query.page ?? "1", 10);
        const limit = parseInt(query.limit ?? "20", 10);

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            return reply.status(400).send({ error: "Invalid page or limit" });
        }

        let where = {};

        if (query.period) {
            const validPeriods: Period[] = ["hourly", "daily", "weekly", "monthly", "yearly"];
            if (!validPeriods.includes(query.period as Period)) {
                return reply.status(400).send({ error: "Invalid period" });
            }
            if (!query.timezone) {
                return reply.status(400).send({ error: "timezone is required when period is set" });
            }

            const periodStart = getPeriodStart(query.period as Period, query.timezone);
            where = { timestamp: { gte: periodStart } };
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: { splits: true },
                orderBy: { timestamp: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.transaction.count({ where }),
        ]);

        return {
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    });

    app.get("/transactions/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { splits: true },
        });

        if (!transaction) {
            return reply.status(404).send({ error: "Transaction not found" });
        }

        return transaction;
    });
}
