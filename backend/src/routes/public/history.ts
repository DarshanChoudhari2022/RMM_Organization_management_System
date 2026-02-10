import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const historyRouter = Router();

historyRouter.get("/", async (_req, res, next) => {
  try {
    const entries = await prisma.historyEntry.findMany({
      orderBy: { year: "asc" },
    });
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

