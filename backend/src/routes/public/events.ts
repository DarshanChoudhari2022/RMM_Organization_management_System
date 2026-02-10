import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ year: "desc" }, { date: "desc" }],
    });
    // Attach image URLs from media items
    const media = await prisma.mediaItem.findMany({
      where: { eventId: { not: null } },
    });
    const byEvent: Record<string, string[]> = {};
    for (const m of media) {
      if (!m.eventId) continue;
      byEvent[m.eventId] ??= [];
      byEvent[m.eventId].push(m.src);
    }
    const enriched = events.map((e) => ({
      ...e,
      images: byEvent[e.id] ?? [],
    }));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

