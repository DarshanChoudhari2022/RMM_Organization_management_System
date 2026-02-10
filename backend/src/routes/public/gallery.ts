import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const galleryRouter = Router();

galleryRouter.get("/", async (_req, res, next) => {
  try {
    const albums = await prisma.album.findMany({
      include: { items: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(albums);
  } catch (err) {
    next(err);
  }
});

