import { dateUtils } from "@/utils";
import { CDIBaseRepository } from "../base";
import { Cdi, Prisma } from "@prisma/client";

export class InMemoryCDIRepository implements CDIBaseRepository {
  private items: Cdi[] = [];

  async create(data: Prisma.CdiCreateInput): Promise<Cdi> {
    const assetInfo: Cdi = {
      ...data,
      date: dateUtils.convertToISODate(data.date) as Date,
      id: this.items.length,
    };
    
    this.items.push(assetInfo);
    
    return assetInfo;
  }

  async getAll() {
    return this.items;
  }

}