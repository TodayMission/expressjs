import { IMain } from "pg-promise";
import { data } from "./data"

export interface IChallenges {

} 

export class CChallenges {
    
    private manager!: data;
    private table = "challenges";

    private challenge_participants_table = "challenge_participants";

    constructor(data: data) {
        this.manager = data; 
    }

    create(name: string, groupId: string, userId: string) {
        this.manager.insert(
            this.table,
            ["name", "group_id", "creator_id"],
            [name, groupId, userId]
        );
    }

    async getAll() {

        let select = await this.manager.select(this.table, ["*"])
        
        return select
    }

    join(challengeId: string, userId: string) {
        this.manager.insert(
            this.challenge_participants_table,
            ["user_id", "challenge_id"],
            [userId, challengeId]
        )
    }

    async isParticipating(challengeId: string, userId: string) : Promise<Boolean> {
        let response = await this.manager.select(this.challenge_participants_table, ["COUNT(id)"], "WHERE user_id = $1 and challenge_id = $2", [userId, challengeId])

        console.log(response[0][0]["count"])

        if(response[0][0]["count"] != 1){
            return false;
        }
        return true;
    }

    leave(challengeId: string, userId: string) {
        this.manager.delete(
            this.challenge_participants_table,
            {
                WHERE: [
                    ["user_id", "AND challenge_id"],
                    [userId, challengeId]
                ]
            }
        )
    }

    cancel(challengeId: string) {
        this.manager.delete(
            this.table,
            {
                WHERE: [
                    ["id"],
                    [challengeId]
                ]
            }
        )
    }

    complete(challengeId: string, userId: string) {
        this.manager.update(
            this.challenge_participants_table,
            ["is_completed"],
            ['t'],
            {
                WHERE: [
                    ["challenge_id", "and user_id"],
                    [challengeId, userId]
                ]
            }
        )
    }
    
}