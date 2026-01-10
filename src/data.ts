import { db } from "./database"

export interface data {
    insert: Function
    select: Function
    delete: Function
    update: Function
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

    update(table: string, keys: Array<String>, values: Array<String>, options: options){
        let updateString: String = this.parseWhere(keys);
        let whereClause: String = this.parseWhere(options.WHERE[0], keys.length);

        console.log(keys.length)
        let whereValues = options.WHERE[1]

        console.log(updateString)
        console.log(whereClause)

        db.none(
            `UPDATE ${table} SET ${updateString} WHERE ${whereClause}`,
            values.concat(whereValues),
        );

    }

    delete(table: String, options: options){

        let whereClause: String = this.parseWhere(options.WHERE[0]);

        let values = options.WHERE[1]

        db.none(
            `DELETE FROM ${table} WHERE ${whereClause}`,
            values
        ).catch((error: Error) => {
            console.log(error.message)
        })
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