import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import {
  loginRouter,
  userInfoRouter,
  tokenRoute,
  authRoutes,
  tokenLogRoute,
  tokenCodesRouter,
  unBindRouter,
  htmlRouter
} from "./routes";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

type Bindings = {
  Latest_Version: string;
  JWT_SECRET: string;
  JWT_EXP: number;
};
const app = new Hono<{ Bindings: Bindings }, { Variables: JwtVariables }>();

app.use('*', cors())
app.use("/api/v1/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET
  });
  return jwtMiddleware(c, next);
});

app.get("/last_version", async (c: Context) =>
  c.json({ version: c.env.Latest_Version })
);
app.route("/api/login", loginRouter); 
app.route("/api/v1/userinfo", userInfoRouter);
app.route("/api/v1/tokeninfo", tokenRoute);
app.route("/api/v1/authinfo", authRoutes);
app.route("/api/v1/tokenlog", tokenLogRoute);
app.route("/api/v2/listen", tokenCodesRouter);
app.route("/unbind",unBindRouter);
app.route("*", htmlRouter); 
export default app;
