import { Request, Response } from "express";
import { CGroups } from "../groups";
import { database } from "../data";

let groups: CGroups = new CGroups(new database());

export function groupCreate(req: Request, res: Response) {
  const name: string = req.body.name as string;

  if (!name) {
    res.status(400).json({ message: "name required" });
    return;
  }

  const user = (req as any).user;
  const creatorId = String(user.userId);

  groups.create(name, creatorId);
  res.json({ message: `group ${name} created`, name });
}