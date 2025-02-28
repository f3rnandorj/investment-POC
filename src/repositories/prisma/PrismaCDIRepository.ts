import { prisma } from "@/lib/prisma";
import { CDIBaseRepository } from "../base";
import { Cdi, Prisma } from "@prisma/client";

export class PrismaCDIRepository implements CDIBaseRepository {
  async create(data: Prisma.CdiCreateInput): Promise<Cdi> {
    return await prisma.cdi.create({ data });
  }
    
  async getAll(): Promise<Cdi[]> {
    return await prisma.cdi.findMany();
  }

}