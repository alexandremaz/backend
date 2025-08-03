import type { MiddlewareHandler } from "hono";

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("[ERROR]", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
