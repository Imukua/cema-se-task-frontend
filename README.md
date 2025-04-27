# Health Information System Frontend (CeMa)

This repository contains the frontend code for the Health Information System (CeMa), built with **Next.js**, **React**, and **TypeScript**.  
The system is designed to manage clients, health programs, and program enrollments, providing a dashboard for statistics and user management.

## 🚀 Live Demo

You can access the live application here:  
**[https://cemasystem.vercel.app/](https://cemasystem.vercel.app/landing)**

## 🔗 Backend Repository

This frontend application interacts with a separate backend API.  
You can find the backend code here:  
**[https://github.com/Imukua/cema-se-task](https://github.com/Imukua/cema-se-task)**

---

## ✨ Features

- **User Authentication**: Secure login and registration for users (doctors/administrators).
- **Dashboard**:
  - Overview of key statistics: total clients, active programs, total enrollments, active enrollments.
  - Charts for enrollment distribution and client growth.
- **Client Management**:
  - View a list of all clients with pagination, searching, and filtering options (gender, age range, programs).
  - Add new client profiles with personal details and notes.
  - View detailed client profiles (personal information, enrolled programs, activity timeline).
  - Edit existing client profiles.
- **Program Management**:
  - View a list of health programs with search and filter by creation date.
  - Add new programs with names and descriptions.
  - View program details: description, creation/update dates, enrollment stats, list of enrolled clients.
  - Edit existing health programs.
- **Enrollment Management**:
  - View a list of program enrollments with pagination, search, and filtering (status, program, enrolled date range).
  - Create new enrollments for clients.
  - Edit enrollment details (status, notes).
- **User Profile**:
  - View and edit your user profile details (name, email).
  - _(Note: Password change functionality is present but may require backend support.)_
- **Responsive Design**: Works well across all device sizes.
- **Theme Toggle**: Switch between light and dark modes.

---

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (built on Radix UI)
- **Charting**: Chart.js, Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Form Management**: React Hook Form, Zod (for validation)
- **State Management**: React Context (for authentication)
- **API Interaction**: Custom API service using `fetch`
- **Linting & Formatting**: ESLint, Prettier

---

## ⚙️ Installation and Setup

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <frontend_repo_url>
   cd imukua-cema-se-task-frontend
   ```
