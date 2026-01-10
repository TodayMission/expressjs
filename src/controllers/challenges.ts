import { RequestHandler } from "express";
import { CChallenges } from "../challenges";
import { database } from "../data";
import { Request, Response } from "express";

let challenge: CChallenges = new CChallenges(new database);


export function challengeCreate(req: Request, res: Response) {
   let name: string = req.query["name"] as string;

  challenge.create(name)

  res.json({ message: name});
}

export async function challengeGetAll(_req: Request, res: Response) {
    let challenges = await challenge.getAll();
    
    res.json(challenges)
}

export function challengeJoin(req: Request, res: Response) {
    let userId: string = req.query['userId'] as string;
    let challengeId: string = req.query['challengeId'] as string;

    challenge.join(challengeId, userId);

    res.json({ message: "Challenges joined successfully"});
}

export async function challengeLeave(req: Request, res: Response) {
    let userId: string = req.query['userId'] as string;
    let challengeId: string = req.query['challengeId'] as string;

    if(await challenge.isParticipating(challengeId, userId)) {
        challenge.leave(challengeId, userId);
        res.json({ message: "You leaved the challenge"})
        return
    }
    res.json({message: "You don't even participate to this challenge"})
}

export async function challengeCancel(req: Request, res: Response) {
    let challengeId: string = req.query['challengeId'] as string;

    console.log(challengeId)

    challenge.cancel(challengeId);
    res.json({message: "Challenge canceled"})
}
