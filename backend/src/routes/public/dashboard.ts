import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dashboardRouter = Router();

dashboardRouter.get("/budget", async (_req, res, next) => {
  try {
    const data = await prisma.varganiBudget.findMany();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/expenses", async (_req, res, next) => {
  try {
    const data = await prisma.expense.findMany();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/monthly-budget", async (_req, res, next) => {
  try {
    const data = await prisma.monthlyBudget.findMany();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

