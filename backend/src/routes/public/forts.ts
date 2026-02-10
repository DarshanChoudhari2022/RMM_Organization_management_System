import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const fortsRouter = Router();

fortsRouter.get("/", async (req, res, next) => {
  try {
    const { region, type } = req.query as { region?: string; type?: string };
    const where: any = {};
    if (region) where.region = region;
    if (type) where.type = type;
    const forts = await prisma.fort.findMany({
      where,
      orderBy: { conquestDate: "asc" },
    });
    res.json(forts);
  } catch (err) {
    next(err);
  }
});

