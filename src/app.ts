import Fastify from "fastify";
import { transactionRoutes } from "./modules/transactions/transaction.routes";
import { categoryRoutes } from "./modules/catogories/category.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import cors from "@fastify/cors";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true, // reflects request origin — fine for local dev
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(transactionRoutes);
  app.register(categoryRoutes);
  app.register(dashboardRoutes);

  return app;
}