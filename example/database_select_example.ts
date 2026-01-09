import { db } from "../src/database"

interface ValueResult {
  value: number
}

db.one('SELECT $1 AS value', "Jean")
  .then((data: ValueResult) => {
    console.log('DATA:', data.value)
  })
  .catch((error: Error) => {
    console.log('ERROR:', error)
  })