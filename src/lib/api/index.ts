import type { HistoryEntry, EventEntry, GalleryAlbum, Task, BudgetItem, Expense } from "@/types";
import historyData from "@/mock-data/history.json";
import eventsData from "@/mock-data/events.json";
import galleryData from "@/mock-data/gallery.json";
import tasksData from "@/mock-data/tasks.json";
import dashboardData from "@/mock-data/dashboard.json";

// Simulate async API calls — swap internals for real backend later

export async function getHistory(): Promise<HistoryEntry[]> {
  return historyData as HistoryEntry[];
}

export async function getEvents(): Promise<EventEntry[]> {
  return eventsData as EventEntry[];
}

export async function getGallery(): Promise<GalleryAlbum[]> {
  return galleryData as GalleryAlbum[];
}

export async function getTasks(): Promise<Task[]> {
  return tasksData as Task[];
}

export async function getBudget(): Promise<BudgetItem[]> {
  return dashboardData.budget as BudgetItem[];
}

export async function getExpenses(): Promise<Expense[]> {
  return dashboardData.expenses as Expense[];
}

export async function getMonthlyBudget(): Promise<{ month: string; budget: number; actual: number }[]> {
  return dashboardData.monthlyBudget;
}
