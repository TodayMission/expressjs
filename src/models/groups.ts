import { data } from "../data";
import { db } from "../database";


enum groupState{
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED"
}

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
        `INSERT INTO group_users (group_id, user_id, joined_at, state)
         VALUES ($1, $2, NOW(), $3)`,
        [created.id, creatorId, groupState.ACCEPTED]
      );

      return created.id;
    });

    return result;
  }

  async sendGroupRequest(group_id: string, user_id: string) {
      await db.none(
        `INSERT INTO group_users (group_id, user_id, joined_at, state)
         VALUES ($1, $2, NOW(), $3)`,
        [group_id, user_id, groupState.PENDING]
      );
  }

  async acceptGroupRequest(group_id: string, user_id: string) {
    await this.manager.update("group_users", ['state'], [groupState.ACCEPTED], {
      WHERE: [
        ['user_id', 'AND group_id', 'AND state'],
        [user_id, group_id, groupState.PENDING]
      ]
    })
  }

  async denyGroupRequest(group_id: string, user_id: string) {
    await this.manager.delete("group_users", {
      WHERE: [
        ['user_id', 'AND group_id', 'AND state'],
        [user_id, group_id, groupState.PENDING]
      ]
    })
  }

  async getUserGroups(user_id: string) {
    let response = await db.multi(
        `SELECT * 
        FROM group_users 
        JOIN groups 
        ON group_users.group_id = groups.id
        WHERE group_users.user_id = $1
        AND group_users.state = $2`,
        [user_id, groupState.ACCEPTED]
    )

    return response
  }

    async getUserPendingGroups(user_id: string) {
    let response = await db.multi(
        `SELECT * 
        FROM group_users 
        JOIN groups 
        ON group_users.group_id = groups.id
        WHERE group_users.user_id = $1
        AND group_users.state = $2`,
        [user_id, groupState.PENDING]
    )

    return response
  }
}
