import jwt from "jsonwebtoken";
import { getEnvVar } from "./getEnvVar.js";

/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param {string} username
 * @return {Promise<string>}
 */
export function generateAuthToken(username) {
  return new Promise((resolve, reject) => {
    const payload = { username };

    jwt.sign(
      payload,
      getEnvVar("JWT_SECRET"),
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}

export function verifyAuthToken(req, res, next) {
    // Call next() to run the next middleware or request handler
    const authHeader = req.get("Authorization");
    // This header's value should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end(); // No token -- cancel subsequent handlers
    } else {
        jwt.verify(token, getEnvVar("JWT_SECRET"), (error, decodedToken) => {
            if (decodedToken) {
                req.userInfo = decodedToken; // Modify the request for subsequent handlers
                next();
            } else {
                res.status(401).end(); // Token is expired or otherwise invalid
            }
        });
    }
}