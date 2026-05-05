import { Request, Response } from "express";
import { database } from "../data";
import { CMessages } from "../models/messages";

const messages = new CMessages(new database());

export async function getGroupMessages(req: Request, res: Response) {
  const groupId = req.params.groupId;

  if (!groupId) {
    return res.status(400).json({ message: "groupId required" });
  }

  const groupMessages = await messages.getByGroup(groupId);
  res.json(groupMessages);
}

export async function createGroupMessage(req: Request, res: Response) {
  const groupId = req.params.groupId;
  const message = req.body.message;
  const authorId = (req as any).user?.userId;

  if (!groupId) {
    return res.status(400).json({ message: "groupId required" });
  }

  if (!message) {
    return res.status(400).json({ message: "message required" });
  }

  if (!authorId) {
    return res.status(401).json({ message: "missing userId in token" });
  }

  const created = await messages.create(authorId, groupId, message);
  res.status(201).json(created);
}
