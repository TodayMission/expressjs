import { db } from "./database"

export interface data {
    insert: Function
    select: Function
}

export class database implements data {

    private formatKey(keys: Array<String>) {
        let keysString: String = "";
        let valueBuilder: string = ""

        keys.forEach((fn, index) => {
            if(index < keys.length - 1) {
                keysString += fn + ", "
                valueBuilder += `$${index + 1}, `
            } else {
                keysString += fn + ""
                valueBuilder += `$${index + 1}`
            }
        })

        return { keyString: keysString,
                 valueBuilder: valueBuilder
               };
    }

    insert(table: String, keys: Array<String>, values: Array<String>) {
        let formatted = this.formatKey(keys);

        db.none(
            `INSERT INTO ${table} (${formatted.keyString})
            VALUES (${formatted.valueBuilder})`,
            values
        ).catch((error: Error) => {
            console.log("Somethings wrong happen : " + error.message)
        })
    }

    async select(table: String, keys: Array<String>) {
        let keysString = this.formatKey(keys).keyString;

        let result = await db.multi(
            `SELECT ${keysString} from ${table}`
        )

        return result;
    }
}