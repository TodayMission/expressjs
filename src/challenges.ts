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

    create(name: string) {
        this.manager.insert(
            this.table,
            ["name"],
            [name]
        );
    }

    async getAll() {

        let select = await this.manager.select(this.table, ["*"])
        
        return select
    }

    join(userId: string, challengeId: string) {
        this.manager.insert(
            this.challenge_participants_table,
            ["user_id", "challenge_id"],
            [userId, challengeId]
        )
    }
}