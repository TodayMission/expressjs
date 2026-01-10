import { IMain } from "pg-promise";
import { data } from "./data"

export interface IChallenges {

} 

export class CChallenges {
    
    private manager!: data;
    private table = "challenges"

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
        
        console.log(select);
        return select
    }
}