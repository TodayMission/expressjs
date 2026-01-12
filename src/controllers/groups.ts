import { Request, Response } from "express";
import { CGroups } from "../groups";
import { database } from "../data";

let groups: CGroups = new CGroups(new database());

export function groupCreate(req: Request, res: Response) {
  const name: string = req.query["name"] as string;
  const creatorId: string = req.query["creatorId"] as string;

  groups.create(name, creatorId);
  res.json({ message: `${name} created`, name });

}