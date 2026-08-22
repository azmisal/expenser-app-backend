import Fastify from "fastify";
import { transactionRoutes } from "./modules/transactions/transaction.routes";
import { categoryRoutes } from "./modules/catogories/category.routes";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(transactionRoutes);
  app.register(categoryRoutes);

  return app;
}