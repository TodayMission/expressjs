import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const token = auth.slice("Bearer ".length);
  try {
    const decoded = verifyJwt(token);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
