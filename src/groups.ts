import { data } from "./data";

export class CGroups {
  private manager!: data;
  private table = "groups";

  constructor(data: data) {
    this.manager = data;
  }

  async create(name: string, creatorId: string) { 
      await this.manager.insert(
        this.table,
        ["name", "creator_id"],
        [name, creatorId]
      );
  }
}
