import { RequestHandler } from "express";
import { CChallenges } from "../challenges";
import { database } from "../data";
import { Request, Response } from "express";

let challenge: CChallenges = new CChallenges(new database);


export function challengeCreate(_req: Request, res: Response) {
   let name: string = _req.query["name"] as string;

  challenge.create(name)

  res.json({ message: name});
}

export async function challengeGetAll(_req: Request, res: Response) {
    let challenges = await challenge.getAll();
    
    res.json(challenges)
}