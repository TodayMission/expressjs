import { data } from "./data";
import { db } from "./database";


export class CGroups {
  private manager!: data;
  private table = "groups";

  constructor(data: data) {
      this.manager = data; 
  }

  async create(name: string, creatorId: string) {
    const result = await db.tx(async (t) => {
      const created = await t.one(
        `INSERT INTO groups (name, creator_id)
         VALUES ($1, $2)
         RETURNING id`,
        [name, creatorId]
      );

      await t.none(
        `INSERT INTO group_users (group_id, user_id, joined_at)
         VALUES ($1, $2, NOW())`,
        [created.id, creatorId]
      );

      return created.id;
    });

    return result;
  }

  async getUserGroups(user_id: string) {
    let response = await db.multi(
        `SELECT * 
        FROM group_users 
        JOIN groups 
        ON group_users.group_id = groups.id
        WHERE group_users.user_id = $1`,
        user_id
    )
    // let response = await this.manager.select("group_users", ["*"], {
    //   WHERE: [
    //     ["user_id"],
    //     [user_id]
    //   ]
    // })
    return response
  }
}
