import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

const uSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.email(),
    age: z.number().gt(18),
  })
  .openapi({
    example: {
      name: "toto",
      email: "google@gmail.com",
      age: 19,
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
