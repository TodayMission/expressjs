import { data } from "./data";

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
      "WHERE email = $1 AND password_hashed = $2",
      [email, password]
    );

    const user = response?.[0]?.[0];
    if (!user) return null;

    return response
  }
}
