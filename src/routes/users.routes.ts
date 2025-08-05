import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

const uSchema = z
  .object({
    age: z.number().gt(18),
    email: z.email(),
    name: z.string().nonempty(),
  })
  .openapi({
    example: {
      age: 19,
      email: "google@gmail.com",
      name: "toto",
    },
  });

const rSchema = z.object({
  message: z.literal("User created"),
  user: uSchema,
});

const route = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: uSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: rSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});

export const users = new OpenAPIHono()
  .basePath("/users")
  .openapi(route, (c) => {
    const user = c.req.valid("json");
    return c.json({
      message: "User created" as const,
      user,
    });
  });
