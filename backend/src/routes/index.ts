import { Router } from "express";
import { historyRouter } from "./public/history";
import { eventsRouter } from "./public/events";
import { galleryRouter } from "./public/gallery";
import { tasksRouter } from "./public/tasks";
import { dashboardRouter } from "./public/dashboard";
import { fortsRouter } from "./public/forts";

export const router = Router();

router.use("/history", historyRouter);
router.use("/events", eventsRouter);
router.use("/gallery", galleryRouter);
router.use("/tasks", tasksRouter);
router.use("/dashboard", dashboardRouter);
router.use("/forts", fortsRouter);

