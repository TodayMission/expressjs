import { Request, Response } from "express";
import { CGroups } from "../models/groups";
import { database } from "../data";

let groups: CGroups = new CGroups(new database);

export function groupCreate(req: Request, res: Response) {
  const name: string = req.body.name as string;

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
    const groupId = groups.create(name, String(creatorId));
    res.json({ message: `group ${name} created`, name, groupId });
  } catch (error) {
    res.status(500).json({ message: "error creating group" });
  }
}

export async function getMyGroups(req: Request, res: Response) {
  const user = (req as any).user;
  const userId = user?.userId;

  let _groups = await groups.getUserGroups(userId)
  
  return res.send(_groups[0])
}