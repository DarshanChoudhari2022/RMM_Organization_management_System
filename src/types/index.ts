export interface HistoryEntry {
  id: string;
  year: number;
  titleMarathi: string;
  titleEnglish: string;
  description: string;
  category: "fort" | "battle" | "treaty" | "event";
  image: string;
  source: {
    book: string;
    page: number;
  };
}

export interface EventEntry {
  id: string;
  year: number;
  titleMarathi: string;
  titleEnglish: string;
  description: string;
  date: string;
  location: string;
  images: string[];
}

export interface GalleryAlbum {
  id: string;
  name: string;
  nameMarathi: string;
  cover: string;
  category: "forts" | "ceremonies" | "rallies";
  images: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Task {
  id: string;
  titleMarathi: string;
  titleEnglish: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected";
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  month: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: "approved" | "pending" | "rejected";
}
