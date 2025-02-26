import { Cdi } from "@prisma/client";

export interface CDIBaseRepository {
  getAll: () => Promise<Cdi[]>
}