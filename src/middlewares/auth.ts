import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.json({ message: "Missing token" });
    return;
  }

  const token = auth.slice("Bearer ".length);
  try {
    const decoded = verifyJwt(token);
    (req as any).user = decoded;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
}
