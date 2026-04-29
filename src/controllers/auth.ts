import { Request, Response } from "express";
import { CAuth } from "../auth";
import { database } from "../data";

let auth: CAuth = new CAuth(new database());

export async function userLogin(req: Request, res: Response) {
  console.log(req.body)
  
  const email: string = req.body.email as string;
  const password: string = req.body.password as string; 

  const result = await auth.login(email, password);
  if (!result) {
    res.json({ message: "invalid name or password" });
    return;
  }

  res.json(result);
}
