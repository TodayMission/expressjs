import { data } from "./data";

export class CGroups {
  private manager!: data;
  private table = "groups";

  constructor(data: data) {
    this.manager = data;
  }

  async create(name: string) {
    try{
      await this.manager.insert(this.table, ["name", "creator_id"], [name, "1"]);
    } catch (error) {
        console.error("Error creating group:", error);
    }
  }
}
