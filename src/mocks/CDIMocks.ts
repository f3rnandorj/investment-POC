import { Prisma } from "@prisma/client";

const CDIToCreate: Prisma.CdiCreateInput[] = [
  { date: "24/01/2024", rate: 0.043739 },
  { date: "25/01/2024", rate: 0.043739 },
  { date: "26/01/2024", rate: 0.043739 },
  { date: "29/01/2024", rate: 0.043739 },
  { date: "30/01/2024", rate: 0.043739 },
];

export const CDIMocks = {
  CDIToCreate
};