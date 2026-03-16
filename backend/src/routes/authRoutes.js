import express from "express";
import { generateAuthToken } from "../authUtils.js";

export function registerAuthRoutes(app, credentialsProvider) {
  const usersRouter = express.Router();
  const sessionsRouter = express.Router();

  // Register user
  usersRouter.post("/", async (req, res) => {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      res.status(400).send({
        error: "Missing username, email, or password",
      });
      return;
    }

    const result = await credentialsProvider.registerUser(
      username,
      email,
      password
    );

    if (!result) {
      res.status(409).send({
        error: "Username or email already taken",
      });
      return;
    }

    const token = await generateAuthToken(username);

    res.status(200).send({ token })
  });

  // Login / create session
  sessionsRouter.post("/", async (req, res) => {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      res.status(400).send({
        error: "Missing username or password",
      });
      return;
    }

    const isValid = await credentialsProvider.verifyPassword(
      username,
      password
    );

    if (!isValid) {
      res.status(401).send({
        error: "Invalid username or password",
      });
      return;
    }

    const token = await generateAuthToken(username);

    res.status(200).send({ token });
  });

  app.use("/api/users", usersRouter);
  app.use("/api/sessions", sessionsRouter);
}