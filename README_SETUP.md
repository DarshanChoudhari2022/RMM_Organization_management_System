# Admin Portal Setup Guide

## 1. Database Setup (Crucial Step)

The Admin Portal now uses Supabase for permanent data storage. To make it work, you **must** creating the tables in your Supabase project.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open your Project.
3.  Go to the **SQL Editor** (icon on the left sidebar).
4.  Click **"New Query"**.
5.  Copy the entire content of the file `supabase_schema.sql` (located in your project root).
6.  Paste it into the SQL Editor.
7.  Click **"Run"**.

This will create the following tables:
- `members` (Member directory)
- `vargani_payments` (Year-wise tracking)
- `tasks` (Task management)
- `expenses` (Expense tracking)
- `invitations` (Event invites)
- `task_responses` (Attendance tracking)

## 2. Admin Portal Features

-   **Dashboard**: `http://localhost:5173/dashboard` (Login: `Admin` / `Bliss@108`)
-   **Public Tasks**: `http://localhost:5173/tasks`
-   **Approve Page**: `http://localhost:5173/approve/:taskId` (Linked from Tasks or WhatsApp)

## 3. Year-Wise Management

-   You can now filter Vargani payments and Expenses by Year using the **dropdown selector** in the Dashboard toolbar.
-   Vargani status is tracked per member, per year.

## 4. English UI

-   The interface has been updated to be professional and strictly English.
-   Marathi text has been removed from UI labels.

## 5. Sharing

-   Tasks and Invitations can be shared via WhatsApp.
-   The Task Share link directs members to a dedicated page to select their name and confirm availability.
