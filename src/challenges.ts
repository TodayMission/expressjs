import { IMain } from "pg-promise";
import { data } from "./data"

export class challenges {
    
    manager!: data;

    constructor(data: data) {
        this.manager = data; 
    }

    create(name: string) {
        this.manager.insert(name);
    }

}