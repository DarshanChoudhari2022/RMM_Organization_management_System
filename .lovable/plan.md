

# Shrimant Shivgarjana Prathisthan — Cinematic Cultural Website

## Overview
A premium, immersive cultural website celebrating Chhatrapati Shivaji Maharaj's legacy. Built with React + Vite, featuring 3D visuals, cinematic animations, and bilingual (Marathi + English) content. All data comes from mock JSON files through API-ready service functions.

**Tech:** React, TypeScript, TailwindCSS, React Three Fiber, Framer Motion, React Router

**Theme:** Dark cinematic (#0B0B0F) with saffron (#FF7A00) and gold (#D4AF37) accents

---

## Page 1: 🏰 Landing Page (3D Cinematic Hero)
- **Full-screen 3D scene** with procedural fort geometry, animated saffron flag (cloth simulation), terrain, fog, and cinematic camera orbit
- Shivaji silhouette as a 2D cutout in the 3D scene with dramatic lighting
- Large Devanagari title: "श्रीमंत शिवगर्जना प्रतिष्ठान" with gold gradient
- English tagline beneath
- CTA buttons ("इतिहास जाणा" / "Explore History" and "कार्यक्रम" / "Events")
- Smooth scroll-triggered sections below: Mission statement, key stats (glassmorphism cards), featured events

## Page 2: 📜 History Portal
- Vertical timeline with scroll-based storytelling (Framer Motion animations)
- Each entry shows: year, Marathi heading, English description, fort image card with glassmorphism
- Fort cards in a grid with hover zoom effects
- Each card references source (book name + page number)
- Search bar and category filter (forts, battles, treaties)
- Data from `mock-data/history.json` via `getHistory()`

## Page 3: 🎪 Events (2014–2025)
- Horizontal year selector bar with saffron highlight on active year
- Masonry photo gallery grid for selected year
- Lightbox modal with smooth zoom transitions
- Event details: title (Marathi), description (English), date, location
- Data from `mock-data/events.json` via `getEvents()`

## Page 4: 🖼️ Gallery
- Album selector with cover thumbnails
- Responsive grid layout with smooth hover animations
- Full-screen lightbox with swipe/arrow navigation
- Placeholder gradient images with album categories (Forts, Ceremonies, Rallies)
- Data from `mock-data/gallery.json` via `getGallery()`

## Page 5: ✅ Task Approval (Mobile-First)
- Mobile-optimized card layout showing task details
- Three action buttons: "उपलब्ध" (Available), "अनुपलब्ध" (Not Available), "टिप्पणी" (Comment)
- Comment textarea that appears on selection
- Actions log to `console.log()` only — no backend
- Data from `mock-data/tasks.json` via `getTasks()`

## Page 6: 📊 Admin Dashboard (UI Only)
- Budget overview widgets (glassmorphism cards with gold accents)
- Charts using Recharts: bar chart for expenses, line chart for budgets
- Tasks table with status badges
- Expense list view
- Upload area placeholder (drag-and-drop styled zone, no actual upload)
- All static/mock data, design only

---

## Shared Components
- **Navbar**: Fixed, dark glassmorphism, bilingual links, mobile hamburger menu
- **Card**: Glassmorphism with saffron/gold border glow
- **Button**: Saffron gradient primary, gold outline secondary
- **Modal/Lightbox**: Dark overlay with scale-in animation
- **Timeline**: Vertical scroll-animated component
- **GalleryGrid**: Responsive masonry with hover effects
- **ChartCard**: Recharts wrapper with dark theme
- **Table**: Styled dark table with gold header accents

## Data Architecture
- All mock data in `/mock-data/*.json` (history, events, tasks, members, gallery)
- Service layer in `/lib/api/` with functions like `getHistory()`, `getEvents()` etc.
- Every component fetches through service functions — zero hardcoded data
- Ready for future backend swap (just replace service function internals)

## Design Details
- Dark background (#0B0B0F) throughout
- Saffron (#FF7A00) for CTAs and highlights
- Gold (#D4AF37) for borders, accents, and decorative elements
- Large typography with serif fonts for Devanagari headings
- Parallax scroll effects on landing and history pages
- Smooth page transitions with Framer Motion
- Fully responsive across mobile, tablet, and desktop

