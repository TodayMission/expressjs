import { NextFunction, RequestHandler } from "express";
import { CChallenges } from "../models/challenges";
import { database } from "../data";
import { Request, Response } from "express";

let challenge: CChallenges = new CChallenges(new database);

export function RequireChallengeId(req: Request, res: Response, next: NextFunction){
  const challengeId = req.query.challengeId;

  if (!challengeId) {
    return res.status(400).json({ error: "challengeId is required" });
  }

  next();
}

export function requireUserId(req: Request, res: Response, next: NextFunction){
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  next();
}

export function RequireToCreateChallenge(req: Request, res: Response, next: NextFunction){
    const name = req.query.name;
    const groupId = req.query.groupId;
    const creatorId = req.query.creatorId;

    if (!name) {
        return res.status(400).json({ error: "a name is required" });
    }

    if (!groupId) {
        return res.status(400).json({ error: "groupID is required" });
    }

    if (!creatorId) {
        return res.status(400).json({ error: "creatorId is required" });
    }

    next()
}

export async function challengeCreate(req: Request, res: Response) {
   let name: string = req.query["name"] as string;
   let groupId: string = req.query["groupId"] as string;
   let creatorId: string = req.query["creatorId"] as string;

  await challenge.create(name, groupId, creatorId)

  res.json({ message: name});
}

export async function challengeGetAll(_req: Request, res: Response) {
    let challenges = await challenge.getAll();
    
    res.json(challenges)
}

export async function challengeJoin(req: Request, res: Response) {
    let userId: string = req.query['userId'] as string;
    let challengeId: string = req.query['challengeId'] as string;

    await challenge.join(challengeId, userId);

    res.json({ message: "Challenges joined successfully"});
}

export async function challengeLeave(req: Request, res: Response) {
    let userId: string = req.query['userId'] as string;
    let challengeId: string = req.query['challengeId'] as string;

    if(!await challenge.isParticipating(challengeId, userId)) {
        return res.status(400).json({error: "You don't even participate to this challenge"})
    }
    
    challenge.leave(challengeId, userId);
    res.json({ message: "You leaved the challenge"})
}

export async function challengeCancel(req: Request, res: Response) {
    let challengeId: string = req.query['challengeId'] as string;

    challenge.cancel(challengeId);
    res.json({message: "Challenge canceled"})
}

export async function challengeCompleted(req: Request, res: Response) {
    let challengeId: string = req.query['challengeId'] as string;
    let userId: string = req.query['userId'] as string;
    
    challenge.complete(challengeId, userId);

    res.json({message: "Challenge completed"});
}
