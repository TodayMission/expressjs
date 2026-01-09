import { db } from "./database"

export interface data {
    insert: Function
    select: Function
}

export class database implements data {
    insert(value: String) {
        db.none(
            `INSERT INTO challenges (name)
            VALUES ($1)`,
            value
        ).catch((error: Error) => {
            console.log("Somethings wrong happen")
        })
    }

    select(value: String) {

    }
}