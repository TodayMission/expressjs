import { IMain } from "pg-promise";
import { data } from "../data"

export interface IChallenges {

} 

export class CChallenges {
    
    private manager!: data;
    private table = "challenges";

    private challenge_participants_table = "challenge_participants";

    constructor(data: data) {
        this.manager = data; 
    }

    async create(name: string, groupId: string, userId: string) {
        await this.manager.insert(
            this.table,
            ["name", "group_id", "creator_id"],
            [name, groupId, userId]
        );
    }

    async getAll() {

        let select = await this.manager.select(this.table, ["*"], undefined)
        
        return select
    }

    async join(challengeId: string, userId: string) {
        await this.manager.insert(
            this.challenge_participants_table,
            ["user_id", "challenge_id"],
            [userId, challengeId]
        )
    }

    async isParticipating(challengeId: string, userId: string) : Promise<Boolean> {
        let response = await this.manager.select(this.challenge_participants_table, ["COUNT(id)"], 
            {
                WHERE: [
                    ["user_id", "AND challenge_id"],
                    [userId, challengeId]
                ]
            }
        )

        console.log(response[0][0]["count"])

        if(response[0][0]["count"] == 0){
            return false;
        }
        return true;
    }

    async leave(challengeId: string, userId: string) {
        await this.manager.delete(
            this.challenge_participants_table,
            {
                WHERE: [
                    ["user_id", "AND challenge_id"],
                    [userId, challengeId]
                ]
            }
        )
    }

    async cancel(challengeId: string) {
        await this.manager.delete(
            this.table,
            {
                WHERE: [
                    ["id"],
                    [challengeId]
                ]
            }
        )
    }

    async complete(challengeId: string, userId: string) {
    await this.manager.update(
        this.challenge_participants_table,
        ["is_completed"],
        ["t"],
        {
            WHERE: [
                ["challenge_id", "AND user_id"],
                [challengeId, userId]
            ]
        }
    )
}
async isFullyCompleted(challengeId: string): Promise<boolean> {

    const result = await this.manager.select(
        this.challenge_participants_table,
        ["COUNT(*) as total"],
        {
            WHERE: [["challenge_id"], [challengeId]]
        }
    )

    const done = await this.manager.select(
        this.challenge_participants_table,
        ["COUNT(*) as done"],
        {
            WHERE: [
                ["challenge_id", "AND is_completed"],
                [challengeId, "t"]
            ]
        }
    )

    return result[0][0].total === done[0][0].done
}
async markChallengeAsCompleted(challengeId: string) {
    await this.manager.update(
        "challenges",
        ["status"],
        ["COMPLETED"],
        {
            WHERE: [["id"], [challengeId]]
        }
    )
}
    
}