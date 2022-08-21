import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET || "";

export function useAuth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const tokenIsValid = verify(authToken, JWT_AUTH_SECRET) as {
    username: string;
  };

  if (tokenIsValid && tokenIsValid.username) {
    req.user = tokenIsValid.username;
    return next();
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
}
