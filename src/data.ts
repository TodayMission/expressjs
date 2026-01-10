import { db } from "./database"

export interface data {
    insert: Function
    select: Function
}

export class database implements data {

    private formatKey(keys: Array<String>) : String {
        let keysString: String = "";

        keys.forEach((fn, index) => {
            if(index < keys.length - 1) {
                keysString += fn + ", "
            } else {
                keysString += fn + ""
            }
        })

        return keysString;
    }

    insert(table: String, keys: Array<String>, values: Array<String>) {
        let keysString = this.formatKey(keys);

        db.none(
            `INSERT INTO ${table} (${keysString})
            VALUES ($1)`,
            values
        ).catch((error: Error) => {
            console.log("Somethings wrong happen : " + error.message)
        })
    }

    async select(table: String, keys: Array<String>) {
        let keysString = this.formatKey(keys);

        let result = await db.multi(
            `SELECT ${keysString} from ${table}`
        )

        return result;
    }
}