import * as jwt from "jsonwebtoken";
import { convertDayToSeconds } from "./utils";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET ?? "dev_secret_change_me";

export function signJwt(payload: object, expiresInSeconds: number = convertDayToSeconds(7)) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
