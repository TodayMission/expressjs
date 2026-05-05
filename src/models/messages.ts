import { data } from "../data";
import { db } from "../database";

export class CMessages {
  private manager!: data;
  private table = "messages";

  constructor(data: data) {
    this.manager = data;
  }

  async create(authorId: string, groupId: string, message: string) {
    // Ajoute un message dans un groupe.
    return db.one(
      `INSERT INTO ${this.table} (author_id, group_id, message, send_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, author_id, group_id, message, send_at`,
      [authorId, groupId, message],
    );
  }

  async getByGroup(groupId: string) {
    // Recupere les messages du groupe avec le nom de l'auteur.
    return db.query(
      `SELECT 
          messages.id,
          messages.author_id,
          users.name as author_name,
          messages.group_id,
          messages.message,
          messages.send_at
       FROM messages
       JOIN users ON users.id = messages.author_id
       WHERE messages.group_id = $1
       ORDER BY messages.send_at ASC`,
      [groupId],
    );
  }
}
