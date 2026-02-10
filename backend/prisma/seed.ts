import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient, HistoryCategory, ExpenseStatus, TaskPriority, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadJson<T>(relative: string): T {
  const p = join(__dirname, "..", "..", "src", "mock-data", relative);
  const raw = readFileSync(p, "utf8");
  return JSON.parse(raw) as T;
}

async function main() {
  // Seed one admin user
  const adminEmail = "admin@shivgarjana.org";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: "$2a$10$uFgmQWnJ5D6mDqG1WitVQehcKQb5H6pCDEJcO8t3x0tJ3OJ4fQx9m", // "password123"
      firstName: "Commander",
      lastName: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  // History
  type HistoryJson = Array<{
    id: string;
    year: number;
    titleMarathi: string;
    titleEnglish: string;
    description: string;
    category: "fort" | "battle" | "treaty" | "event";
    image: string;
    source: { book: string; page: number };
  }>;
  const history = loadJson<HistoryJson>("history.json");
  await prisma.historyEntry.deleteMany();
  await prisma.historyEntry.createMany({
    data: history.map((h) => ({
      id: h.id,
      year: h.year,
      titleMarathi: h.titleMarathi,
      titleEnglish: h.titleEnglish,
      description: h.description,
      category: h.category as HistoryCategory,
      imageUrl: h.image,
      sourceBook: h.source.book,
      sourcePage: h.source.page,
    })),
  });

  // Events
  type EventsJson = Array<{
    id: string;
    year: number;
    titleMarathi: string;
    titleEnglish: string;
    description: string;
    date: string;
    location: string;
    images: string[];
  }>;
  const events = loadJson<EventsJson>("events.json");
  await prisma.mediaItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: events.map((e) => ({
      id: e.id,
      year: e.year,
      titleMarathi: e.titleMarathi,
      titleEnglish: e.titleEnglish,
      description: e.description,
      date: e.date,
      location: e.location,
    })),
  });
  for (const e of events) {
    let idx = 0;
    for (const src of e.images) {
      idx += 1;
      await prisma.mediaItem.create({
        data: {
          id: `${e.id}-${idx}`,
          src,
          alt: e.titleEnglish,
          eventId: e.id,
          caption: e.titleMarathi,
        },
      });
    }
  }

  // Gallery albums
  type GalleryJson = Array<{
    id: string;
    name: string;
    nameMarathi: string;
    cover: string;
    category: string;
    images: { id: string; src: string; alt: string; caption?: string }[];
  }>;
  const gallery = loadJson<GalleryJson>("gallery.json");
  await prisma.album.deleteMany();
  for (const album of gallery) {
    await prisma.album.create({
      data: {
        id: album.id,
        name: album.name,
        nameMarathi: album.nameMarathi,
        coverUrl: album.cover,
        category: album.category,
        items: {
          create: album.images.map((img) => ({
            id: img.id,
            src: img.src,
            alt: img.alt,
            caption: img.caption,
          })),
        },
      },
    });
  }

  // Tasks for mobile approval card
  type TasksJson = Array<{
    id: string;
    titleMarathi: string;
    titleEnglish: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    status: "pending" | "approved" | "rejected";
  }>;
  const tasks = loadJson<TasksJson>("tasks.json");
  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: tasks.map((t) => ({
      id: t.id,
      titleMarathi: t.titleMarathi,
      titleEnglish: t.titleEnglish,
      description: t.description,
      assignedTo: t.assignedTo,
      dueDate: t.dueDate,
      priority: t.priority as TaskPriority,
      status: t.status as TaskStatus,
    })),
  });

  // Forts (small starter set matching mock-data/forts.json)
  type FortJson = Array<{
    id: string;
    name: string;
    nameMarathi?: string;
    conquestDate?: string;
    region?: string;
    type?: "hill" | "sea" | "land";
    latitude?: number;
    longitude?: number;
    strategicNotes?: string;
    currentStatus?: string;
    imageUrl?: string;
  }>;
  const forts = loadJson<FortJson>("forts.json");
  await prisma.fort.deleteMany();
  for (const f of forts) {
    await prisma.fort.create({
      data: {
        id: f.id,
        name: f.name,
        nameMarathi: f.nameMarathi,
        conquestDate: f.conquestDate ? new Date(f.conquestDate) : null,
        region: f.region,
        type: f.type ?? null,
        latitude: f.latitude ?? null,
        longitude: f.longitude ?? null,
        strategicNotes: f.strategicNotes,
        currentStatus: f.currentStatus,
        imageUrl: f.imageUrl,
      },
    });
  }

  // Dashboard budgets / expenses / monthlyBudget
  type DashboardJson = {
    budget: { id: string; category: string; allocated: number; spent: number; month: string }[];
    expenses: { id: string; description: string; amount: number; date: string; category: string; status: "approved" | "pending" | "rejected" }[];
    monthlyBudget: { month: string; budget: number; actual: number }[];
  };
  const dashboard = loadJson<DashboardJson>("dashboard.json");
  await prisma.varganiBudget.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.monthlyBudget.deleteMany();

  // For now, keep a single overall vargani budget using sums from mock
  const totalBudget = dashboard.budget.reduce((s, b) => s + b.allocated, 0);
  await prisma.varganiBudget.create({
    data: {
      year: new Date().getFullYear(),
      totalBudget,
      perHeadTarget: 1500,
      memberCount: 15,
    },
  });

  await prisma.expense.createMany({
    data: dashboard.expenses.map((e) => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.date,
      category: e.category,
      status: e.status as ExpenseStatus,
      year: new Date(e.date).getFullYear(),
    })),
  });

  await prisma.monthlyBudget.createMany({
    data: dashboard.monthlyBudget.map((m) => ({
      month: m.month,
      budget: m.budget,
      actual: m.actual,
    })),
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

