import type { HistoryEntry, EventEntry, GalleryAlbum, Task, BudgetItem, Expense, MandaIMember, Invitation, Photo } from "@/types";
import historyData from "@/mock-data/history.json";
import eventsData from "@/mock-data/events.json";
import galleryData from "@/mock-data/gallery.json";
import tasksData from "@/mock-data/tasks.json";
import dashboardData from "@/mock-data/dashboard.json";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5050/api";

async function safeFetch<T>(path: string, fallback: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return await fallback();
  }
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return safeFetch<HistoryEntry[]>("/history", async () => historyData as HistoryEntry[]);
}

export async function getEvents(): Promise<EventEntry[]> {
  return safeFetch<EventEntry[]>("/events", async () => eventsData as EventEntry[]);
}

export async function getGallery(): Promise<GalleryAlbum[]> {
  return safeFetch<GalleryAlbum[]>("/gallery", async () => galleryData as GalleryAlbum[]);
}

export async function getTasks(): Promise<Task[]> {
  return safeFetch<Task[]>("/tasks", async () => tasksData as Task[]);
}

export async function getBudget(): Promise<BudgetItem[]> {
  return safeFetch<BudgetItem[]>("/dashboard/budget", async () => dashboardData.budget as BudgetItem[]);
}

export async function getExpenses(): Promise<Expense[]> {
  return safeFetch<Expense[]>("/dashboard/expenses", async () => dashboardData.expenses as Expense[]);
}

export async function getMonthlyBudget(): Promise<{ month: string; budget: number; actual: number }[]> {
  return safeFetch("/dashboard/monthly-budget", async () => dashboardData.monthlyBudget);
}

export async function getMembers(): Promise<MandaIMember[]> {
  return safeFetch<MandaIMember[]>("/dashboard/members", async () => dashboardData.members as MandaIMember[]);
}

export async function getInvitations(): Promise<Invitation[]> {
  return safeFetch<Invitation[]>("/dashboard/invitations", async () => dashboardData.invitations as Invitation[]);
}

export async function getPhotos(): Promise<Photo[]> {
  return safeFetch<Photo[]>("/dashboard/photos", async () => dashboardData.photos as Photo[]);
}
