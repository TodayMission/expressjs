import { data } from "./data";

export class CGroups {
  private manager!: data;
  private table = "groups";

  constructor(data: data) {
    this.manager = data;
  }

  create(name: string, creatorId: string) {
    this.manager.insert(this.table, ["name", "creator_id"], [name, creatorId]);
  }
}
