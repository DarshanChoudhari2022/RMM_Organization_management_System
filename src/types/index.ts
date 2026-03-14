export interface HistoryEntry {
  id: string;
  year: number;
  titleMarathi: string;
  titleEnglish: string;
  description: string;
  category: "birth" | "education" | "social_reform" | "political" | "conversion" | "legacy" | "event";
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
  category: "ambedkar_jayanti" | "social_work" | "meetings" | "ceremonies";
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
  category: "flag_hosting" | "sound_dj" | "stage_construction" | "decoration" | "murti_installation" | "other";
}

export interface MandaIMember {
  id: string;
  name: string;
  phone: string;
  vargani: number;
  paid: boolean;
  paidDate: string | null;
  role: string;
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

export interface InvitationResponse {
  memberId: string;
  status: "approved" | "declined";
  comment?: string;
  respondedAt: string;
}

export interface Invitation {
  id: string;
  title: string;
  titleMarathi: string;
  date: string;
  time: string;
  location: string;
  message: string;
  responses: InvitationResponse[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: string;
  year: number;
  uploadDate: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}
