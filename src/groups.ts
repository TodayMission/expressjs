import { db } from "./database";

export class CGroups {
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
  
}
