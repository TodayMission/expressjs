import { data } from "./data";

export class CGroups {
  private manager!: data;
  private table = "groups";

  constructor(data: data) {
    this.manager = data;
  }

  async create(name: string, creatorId: string) {
    try {
      if (!creatorId) throw new Error("creatorId missing");

      await this.manager.insert(
        this.table,
        ["name", "creator_id"],
        [name, creatorId]
      );
    } catch (error) {
      console.error("Error creating group:", error);
      throw error; 
    }
  }
}
