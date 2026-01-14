import { Request, Response } from "express";
import { CGroups } from "../groups";
import { database } from "../data";

let groups: CGroups = new CGroups(new database());

export async function groupCreate(req: Request, res: Response) {
  const name: string = req.query["name"] as string;

  if (!name) {
    res.status(400).json({ message: "name required" });
    return;
  }

  const user = (req as any).user;
  const creatorId = user?.userId;

  if (!creatorId) {
    res.status(401).json({ message: "missing userId in token" });
    return;
  }

  try {
    await groups.create(name, String(creatorId));
    res.json({ message: `group ${name} created`, name });
  } catch (error) {
    res.status(500).json({ message: "error creating group" });
  }
}