import { IMain } from "pg-promise";
import { data } from "../data"

export interface IFiles {

} 

export class Files {
    
    private manager!: data;
    private table = "files";

    constructor(data: data) {
        this.manager = data; 
    }

    async upload(userId: string, filename: string, path: string){
        await this.manager.insert(this.table, ["user_id", "filename", "path"], [userId, filename, path])
    }

    async deleteWithId(id: string){
        await this.manager.delete(this.table, {
            WHERE: [
                ["id"],
                [id]
            ]
        })
    }
    
    async get(id: string){
        return await this.manager.select(this.table, ["*"], {WHERE: [["id"], [id]]})
    }
}