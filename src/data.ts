import { assert } from "console"
import { db } from "./database"

export interface data {
    insert(table: String, keys: Array<String>, values: Array<String>): Promise<void>
    select(table: String, keys: Array<String>, options: options | undefined): Promise<any>
    delete(table: String, options: options): Promise<void>
    update(table: string, keys: Array<String>, values: Array<String>, options: options): Promise<void>
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

    private parseWhere(columns: Array<String>, value = 0){
        let stringBuilder: String = ""; 

        let different = value > 0 

        columns.forEach( (element: String, index: number) => {
            if(different){
                stringBuilder += `${element} = $${value+1} `
                value++
            } else {
                stringBuilder += `${element} = $${index+1} `
            }
        });

        return stringBuilder;
    }

    async insert(table: String, keys: Array<String>, values: Array<String>) {
        let formatted = this.formatKey(keys);

        await db.none(
            `INSERT INTO ${table} (${formatted.keyString})
            VALUES (${formatted.valueBuilder})`,
            values
        )
    }

    async update(table: string, keys: Array<String>, values: Array<String>, options: options){
        let updateString: String = this.parseWhere(keys);
        let whereClause: String = this.parseWhere(options.WHERE[0], keys.length);

        let whereValues = options.WHERE[1]

        await db.none(
            `UPDATE ${table} SET ${updateString} WHERE ${whereClause}`,
            values.concat(whereValues),
        );

    }

    async delete(table: String, options: options){

        let whereClause: String = this.parseWhere(options.WHERE[0]);

        let values = options.WHERE[1]

        await db.none(
            `DELETE FROM ${table} WHERE ${whereClause}`,
            values
        )
    }

    async select(table: String, keys: Array<String>, options: options) {
        let keysString = this.formatKey(keys).keyString;
        
        let whereClause: String = ""
        let values: String[] = []

        if(options){
            whereClause = "WHERE " + this.parseWhere(options.WHERE[0])
            values = options.WHERE[1]
        }

        let result = await db.multi(
            `SELECT ${keysString} from ${table} ${whereClause}`,
            values
        )

        return result;
    }
}