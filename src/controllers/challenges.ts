import { NextFunction } from "express";
import { CChallenges } from "../models/challenges";
import { database } from "../data";
import { Request, Response } from "express";

let challenge: CChallenges = new CChallenges(new database());

export function RequireChallengeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const challengeId = req.body.challengeId;

  if (!challengeId) {
    return res.status(400).json({ error: "challengeId is required" });
  }

  next();
}

export function requireUserId(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  next();
}

export function RequireToCreateChallenge(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const name = req.body.name;
  const groupId = req.body.groupId;
  const creatorId = (req as any).user?.userId;

  if (!name) {
    return res.status(400).json({ error: "a name is required" });
  }

  if (!groupId) {
    return res.status(400).json({ error: "groupID is required" });
  }

  next();
}

export async function challengeCreate(req: Request, res: Response) {
  let name: string = req.body.name;
  let groupId: string = req.body.groupId;
  const creatorId = (req as any).user.userId;

  if (!creatorId) {
    return res.status(401).json({ message: "missing userId in token" });
  }

  await challenge.create(name, groupId, creatorId);
  await challenge.create(name, groupId, creatorId);

  res.json({ message: name });
}

export async function challengeGetAll(req: Request, res: Response) {
  const groupId = req.query.groupId as string | undefined;

  if (groupId) {
    const userId: string = (req as any).user.userId;
    const challenges = await challenge.getByGroup(groupId, userId);
    return res.json(challenges);
  }

  let challenges = await challenge.getAll();

  res.json(challenges);
}

export async function challengeJoin(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  let challengeId: string = req.body.challengeId as string;

  await challenge.join(challengeId, userId);

  res.json({ message: "Challenges joined successfully" });
}

export async function challengeLeave(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  let challengeId: string = req.body.challengeId as string;

  if (!(await challenge.isParticipating(challengeId, userId))) {
    return res
      .status(400)
      .json({ error: "You don't even participate to this challenge" });
  }

  challenge.leave(challengeId, userId);
  res.json({ message: "You leaved the challenge" });
}

export async function challengeCancel(req: Request, res: Response) {
  let challengeId: string = req.body.challengeId as string;

  await challenge.cancel(challengeId);
  res.json({ message: "Challenge canceled" });
}

export async function challengeCompleted(req: Request, res: Response) {
  let challengeId: string = req.body.challengeId as string;

  const userId = (req as any).user.userId;

  await challenge.complete(challengeId, userId);

  res.json({ message: "Challenge completed" });
}

export async function getChallengesForUser(req: Request, res: Response) {
  const userId = req.params.userId;
  let challenges = await challenge.getChallengesForUser(userId);
  res.json(challenges);
}
