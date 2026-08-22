import { FastifyInstance } from "fastify";
import { categoryEnum } from "../catogories/categories.schema";

export async function categoryRoutes(app: FastifyInstance) {
    app.get("/categories", async () => {
        return categoryEnum.options;
    });
}