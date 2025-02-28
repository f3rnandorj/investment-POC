import { Cdi, Prisma } from "@prisma/client";

export interface CDIBaseRepository {
  getAll: () => Promise<Cdi[]>
  create: (data: Prisma.CdiCreateInput) => Promise<Cdi>
}