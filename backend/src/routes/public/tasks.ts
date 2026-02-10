import { Router } from "express";
import { PrismaClient, ApprovalStatus } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
export const tasksRouter = Router();

tasksRouter.get("/", async (_req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { dueDate: "asc" },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

const approveBody = z.object({
  action: z.enum(["APPROVED", "DECLINED"]),
  comment: z.string().max(500).optional(),
});

// Simple approval endpoint for unique links: /api/tasks/approve/:token
tasksRouter.post("/approve/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const parsed = approveBody.parse(req.body);

    const approval = await prisma.approval.findUnique({ where: { token } });
    if (!approval || (approval.expiresAt && approval.expiresAt < new Date())) {
      return res.status(404).json({ error: "Link expired or invalid" });
    }

    const updated = await prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: parsed.action as ApprovalStatus,
        comment: parsed.comment,
        respondedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

