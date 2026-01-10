import { db } from "./database"

export interface data {
    insert: Function
    select: Function
    delete: Function
}

interface options {
    WHERE: Array<Array<String>>
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

    delete(table: String, options: options){
        
        let stringBuilder: String = ""; 

        let columns = options.WHERE[0];
        let values = options.WHERE[1];

        columns.forEach( (element: String, index: number) => {
            stringBuilder += `${element} = $${index+1} `
        });

        db.none(
            `DELETE FROM ${table} WHERE ${stringBuilder}`,
            values
        )
    }

    async select(table: String, keys: Array<String>, option: String, args: Array<String>) {
        let keysString = this.formatKey(keys).keyString;

        let result = await db.multi(
            `SELECT ${keysString} from ${table} ${option}`,
            args
        )

        return result;
    }
}