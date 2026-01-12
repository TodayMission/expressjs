import { Request, Response } from "express";
import { CAuth } from "../auth";
import { database } from "../data";

let auth: CAuth = new CAuth(new database());

export async function userLogin(req: Request, res: Response) {
  const email: string = req.query["email"] as string;
  const password: string = req.query["password"] as string; 

  const result = await auth.login(email, password);
  if (!result) {
    res.json({ message: "invalid name or password" });
    return;
  }

  res.json(result);
}
