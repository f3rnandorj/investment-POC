import { prisma } from "@/lib/prisma";
import { CDIBaseRepository } from "../base";
import { Cdi } from "@prisma/client";

export class PrismaCDIRepository implements CDIBaseRepository {
  async getAll(): Promise<Cdi[]> {
    return await prisma.cdi.findMany();
  }

}