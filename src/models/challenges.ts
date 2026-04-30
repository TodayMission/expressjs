import { data } from "../data";
import { db } from "../database";

export interface IChallenges {}

export class CChallenges {
  private manager!: data;
  private table = "challenges";

  private challengeParticipantsTable = "challenge_participants";

  constructor(data: data) {
    this.manager = data;
  }

  async create(name: string, groupId: string, userId: string) {
    await this.manager.insert(
      this.table,
      ["name", "group_id", "creator_id"],
      [name, groupId, userId],
    );
  }

  async getAll() {
    let select = await this.manager.select(this.table, ["*"], undefined);

    return select;
  }

  async getByGroup(groupId: string, userId: string) {
    const challenges = await this.manager.select(this.table, ["*"], {
      WHERE: [["group_id"], [groupId]],
    });

    const participations = await this.manager.select(
      this.challengeParticipantsTable,
      ["challenge_id"],
      {
        WHERE: [["user_id"], [userId]],
      },
    );

    const joinedChallengeIds = new Set(
      participations[0].map((participation: any) => participation.challenge_id),
    );

    return challenges[0].map((challenge: any) => ({
      ...challenge,
      isJoined: joinedChallengeIds.has(challenge.id),
    }));
  }

  async join(challengeId: string, userId: string) {
    await this.manager.insert(
      this.challengeParticipantsTable,
      ["user_id", "challenge_id"],
      [userId, challengeId],
    );
  }

  async isParticipating(challengeId: string, userId: string): Promise<boolean> {
    let response = await this.manager.select(
      this.challengeParticipantsTable,
      ["COUNT(id)"],
      {
        WHERE: [
          ["user_id", "AND challenge_id"],
          [userId, challengeId],
        ],
      },
    );

    return response[0][0]["count"] != 0;
  }

  async leave(challengeId: string, userId: string) {
    await this.manager.delete(this.challengeParticipantsTable, {
      WHERE: [
        ["user_id", "AND challenge_id"],
        [userId, challengeId],
      ],
    });
  }

  async cancel(challengeId: string) {
    await this.manager.delete(this.table, {
      WHERE: [["id"], [challengeId]],
    });
  }

  async complete(challengeId: string, userId: string) {
    await this.manager.update(
      this.challengeParticipantsTable,
      ["is_completed"],
      ["t"],
      {
        WHERE: [
          ["challenge_id", "and user_id"],
          [challengeId, userId],
        ],
      },
    );
  }

  async getChallengesForUser(userId: string) {
    return db.query(
      `SELECT c.*
         FROM challenges c
         INNER JOIN challenge_participants cp ON cp.challenge_id = c.id
         WHERE cp.user_id = $1`,
      [userId],
    );
  }
}
