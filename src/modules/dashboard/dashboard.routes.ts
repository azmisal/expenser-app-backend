import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";
import { getPeriodStart, Period } from "../transactions/transaction.filters";

export async function dashboardRoutes(app: FastifyInstance) {
    app.get("/dashboard/summary", async (request, reply) => {
        const query = request.query as { period?: string; timezone?: string };

        const validPeriods: Period[] = ["hourly", "daily", "weekly", "monthly", "yearly"];
        if (!query.period || !validPeriods.includes(query.period as Period)) {
            return reply.status(400).send({ error: "Invalid or missing period" });
        }
        if (!query.timezone) {
            return reply.status(400).send({ error: "timezone is required" });
        }

        const periodStart = getPeriodStart(query.period as Period, query.timezone);
        const now = new Date();

        const transactions = await prisma.transaction.findMany({
            where: { timestamp: { gte: periodStart } },
        });

        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalMySpent = transactions.reduce((sum, t) => sum + t.mySpent, 0);

        const categoryTotals = new Map<string, { total: number; mySpent: number }>();
        for (const t of transactions) {
            const existing = categoryTotals.get(t.category) ?? { total: 0, mySpent: 0 };
            categoryTotals.set(t.category, {
                total: existing.total + t.amount,
                mySpent: existing.mySpent + t.mySpent,
            });
        }

        const byCategory = Array.from(categoryTotals.entries()).map(([category, values]) => ({
            category,
            total: values.total,
            mySpent: values.mySpent,
        }));

        return {
            period: query.period,
            from: periodStart.toISOString(),
            to: now.toISOString(),
            totalSpent,
            totalMySpent,
            byCategory,
        };
    });
}