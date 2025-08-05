import { serve } from "bun";
import { hc } from "hono/client";
import { createServer } from "./core/server";
import { users } from "./routes/users.routes";

const toto = createServer(users);

serve({ fetch: toto.fetch, port: 3000 });
console.log("🚀 Server running at http://localhost:3000/doc");

type Routes = typeof toto;

const client = hc<Routes>("http://localhost:3000");

const res = await client.users.$post({
  json: {
    age: 30,
    email: "toto@toto.com",
    name: "toto",
  },
});

const response = await res.json();
const { message } = response;
console.log({
  message,
});
