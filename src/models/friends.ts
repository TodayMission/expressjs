import { data } from "../data";
import { db } from "../database";

enum states {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED"
}

export class CFriends {
  private manager!: data;
   private table = "friendships";
 
   constructor(data: data) {
       this.manager = data; 
   }
 
   async createFriendRequest(requester: string, addressee: string) {
        this.manager.insert(this.table, ["requester_id", "addressee_id", "status"], [requester, addressee, states.PENDING])
   }

   async acceptFriendRequest(requester: string, addressee: string){
        this.manager.update(this.table, ["status"], [states.ACCEPTED], {
            WHERE: [
                ["requester_id", "and addressee_id"],
                [requester, addressee]
            ]
        } )
   }

   async getFriends(user_id: string){
    return await db.query(
        `SELECT 
            u.id,
            u.name
        FROM friendships f
        JOIN users u 
        ON u.id = CASE 
                    WHEN f.requester_id = $2 THEN f.addressee_id
                    ELSE f.requester_id
                    END
        WHERE f.status = $1
        AND (f.requester_id = $2 OR f.addressee_id = $2)`,
        [states.ACCEPTED, user_id]
    );
   }

   async getIncoming(user_id: string){
    return await db.query(
        `SELECT 
            u.id,
            u.name
        FROM friendships f
        JOIN users u 
        ON u.id = f.requester_id
        WHERE f.status = $1
        AND f.addressee_id = $2`,
        [states.PENDING, user_id]
    );
   }

      async getPending(user_id: string){
        return await db.query(
        `SELECT 
            u.id,
            u.name
        FROM friendships f
        JOIN users u 
        ON u.id = f.addressee_id
        WHERE f.status = $1
        AND f.requester_id = $2`,
        [states.PENDING, user_id]
    );
   }

   async deleteFriend(requester: string, addressee: string){
       let response = await db.query(`
        DELETE FROM friendships
        WHERE 
            (requester_id = $1 AND addressee_id = $2)
            OR
            (requester_id = $2 AND addressee_id = $1);`,
        [requester, addressee]
    )
   }

   async denyFriendRequest(requester: string, addressee: string) {
        this.manager.delete(this.table, {
            WHERE: [
                ["requester_id", "and addressee_id"],
                [requester, addressee]
            ]
        } )
   }

}