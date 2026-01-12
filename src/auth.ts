import { data } from "./data";
import { signJwt } from "./jwt";
import { convertDayToSeconds } from "./utils";

export class CAuth {
  private manager!: data;
  private table = "users";

  constructor(data: data) {
    this.manager = data;
  }

  async login(email: string, password: string) {
    const response = await this.manager.select(
      this.table,
      ["id", "name", "email", "avatar_url"],
      {
        WHERE: [
          ["email", "and password_hashed"],
          [email, password]
        ]
      }
    );

    const user = response?.[0]?.[0];
    if (!user) return null;

    const token = signJwt(
      { userId: user["id"], email: user["email"] },
      convertDayToSeconds(7)
    );
    return {token, response}
  }
}
