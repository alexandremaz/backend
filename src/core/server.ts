import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { errorHandler } from "./middlewares/error";
import { logger } from "./middlewares/logger";
import type { Env, Schema } from "hono";

/**
 * Build the main Hono app and mount the given route tree.
 *
 * @param routes – A fully-typed OpenAPIHono router containing our business routes.
 */
export const createServer = <
  E extends Env, // Env (Bindings / Variables)
  S extends Schema, // Collected OpenAPI schemas
  P extends string = "/", // Base path of the router
>(
  routes: OpenAPIHono<E, S, P>,
): OpenAPIHono<E, S, P> => {
  // Create the root app using the same generics as the provided router
  const app = new OpenAPIHono<E, S, P>();

  /* ---------- Global middlewares ---------- */
  app.use("*", errorHandler);
  app.use("*", logger);

  /* ---------- OpenAPI JSON + Swagger UI ---------- */
  app.doc("/doc", {
    openapi: "3.0.0",
    info: { title: "My API", version: "1.0.0" },
  });
  app.get("/ui", swaggerUI({ url: "/doc" }));

  /* ---------- Mount business routes ---------- */
  app.route("/", routes);

  /* ---------- 404 fallback ---------- */
  app.notFound((c) => c.json({ error: "Not Found" }, 404));

  return app;
};
