# 🏡 PropFind — Premium Real Estate Ecosystem

> A state-of-the-art, production-ready real estate management platform optimized for the Pakistani property market. Built using **Next.js 16 (Turbopack)**, **React 19**, and **Tailwind CSS v4** for a high-performance, visual-first user experience.

---

## 📌 Table of Contents

- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [🔌 API Integration Layer](#-api-integration-layer)
- [🛡️ Security \& Auth Guard System](#️-security--auth-guard-system)
- [🛠️ Getting Started](#️-getting-started)
- [⚙️ Available Scripts](#️-available-scripts)
- [🎨 Design & Styling Guidelines](#-design--styling-guidelines)

---

## 🚀 Key Features

PropFind supports a robust role-based dashboard ecosystem mapping three core scopes: **Buyer**, **Agent**, and **Administrator**.

### 👑 Premium Admin Console (`/admin`)
* **Real-time Business Intelligence**: Dashboard overview stats mapped directly from the backend API `/admin/stats`.
* **Dynamic Analytics**: Scaling charts representing user registration trajectories and properties listed per month, rendering actual data.
* **Instant Export Engine**: Compile administrative summaries and active agent metrics into a CSV spreadsheet download.
* **User Management (`/admin/users`)**: Search, filter, promote, block, and delete buyers/agents with instant confirmation safeguards.
* **Property Inspection Center (`/admin/properties`)**: Review queue featuring Approve/Reject workflows (with custom reason inputs like *"Images are not clear"*), featured status toggles, and deletion.
* **Category Configuration (`/admin/categories`)**: Dynamic category manager to add, edit, or toggle property visibility, with dynamic emoji auto-rendering.

### 💼 Agent Workspace (`/dashboard`)
* **Inquiry Dashboard**: Receive real-time client inquiry notifications and mark responses.
* **Listing Studio**: Add and edit property records complete with image galleries, pricing configurations, and metadata specs.
* **Profile Settings**: Update biography, specialized agency names, and upload profile pictures.

### 🌐 Public Portal
* **Omni-Search Bar**: Advanced filter sidebar containing query parameters for price, locations, property specs, and type.
* **Wishlists**: Persisted user-favorite bookmarks.

---

## 💻 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Core Framework** | Next.js 16 (App Router) | High-performance routing, Turbopack, and SSR/CSR flexibility. |
| **View Layer** | React 19 | Declarative state, modern hooks (`useCallback`, `useMemo`). |
| **Styling Engine** | Tailwind CSS v4 | Utility-first classes with transition-micro-animations. |
| **API Client** | Axios | Custom interceptors, error boundaries, and token authorization. |
| **State Management** | Context API | Global authentication provider (`AuthContext`). |

---

## 📂 Project Architecture

```bash
src/
├── app/                        # Next.js App Router (File-system routes)
│   ├── page.js                 # Portal Homepage
│   ├── layout.js               # Global Providers wrapper (Auth, styles)
│   ├── login/                  # User Sign-In route
│   ├── register/               # User Registration route
│   ├── properties/             # Public property list & detailed pages
│   ├── agents/                 # Public agent profiles directory
│   ├── dashboard/              # Protected Agent Workspace route
│   └── admin/                  # Protected Admin Administration Console
│       ├── users/              # /admin/users route
│       ├── properties/         # /admin/properties route
│       ├── categories/         # /admin/categories route
│       └── inquiries/          # /admin/inquiries route
├── components/                 # Reusable functional React components
│   ├── admin/                  # Admin-specific modules (Dashboard, Sidebars, Users, Listings)
│   ├── dashboard/              # Agent workspaces components
│   ├── guards/                 # PrivateRoute & RoleGuard components
│   ├── Navbar.jsx              # Universal responsive navigation bar
│   └── Footer.jsx              # Universal site footer
├── context/
│   └── AuthContext.jsx         # Context provider for session state
├── lib/
│   └── adminApi.js             # Consolidated Admin HTTP request wrapper client
```

---

## 🔌 API Integration Layer

All backend endpoints are integrated in [adminApi.js](file:///c:/Projects/realstate/fontend/src/lib/adminApi.js) utilizing an Axios client:

### 📊 System Stats & Dashboard
* `GET /admin/stats` - Fetch platform-wide summary metrics.
* `GET /admin/users` - Paginated administrative directory query (supports filters: `role`, `isBlocked`, `search`, `page`, `limit`).

### 👥 User Mutations
* `GET /admin/users/:id` - Fetch comprehensive details for user preview.
* `PUT /admin/users/:id/block` - Block/unblock access.
* `PUT /admin/users/:id/promote` - Promote buyer to agent status.
* `DELETE /admin/users/:id` - Permanent database user removal.

### 🏢 Property Actions
* `GET /properties/admin/pending` - Retrieve listing approval queue.
* `PUT /properties/admin/:id/approve` - Approve property for public portal.
* `PUT /properties/admin/:id/reject` - Reject property with custom reason body payload (`{ reason: string }`).
* `PUT /properties/admin/:id/featured` - Toggle feature status.
* `DELETE /properties/admin/:id` - Deletion mutation.

### 🏷️ Categories Setup
* `GET /admin/categories` - Fetch all categories.
* `POST /admin/categories` - Create new listing categories (`name`, `description`, `isActive`).
* `PUT /admin/categories/:id` - Update category information.
* `DELETE /admin/categories/:id` - Remove listing category.

---

## 🛡️ Security & Auth Guard System

PropFind uses Next.js layout guards to restrict routes based on user credentials.

```jsx
// src/components/guards/PrivateRoute.jsx
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function RoleGuard({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingSkeleton />;
  if (!user || !allowedRoles.includes(user.role)) {
    router.push("/login");
    return null;
  }
  return children;
}
```

---

## 🛠️ Getting Started

Follow these steps to run the PropFind frontend locally:

### 1. Prerequisite Installations
* Node.js v18.0 or newer
* npm v9.0 or newer

### 2. Install Project Dependencies
```bash
# Clone the repository and install packages
git clone <repository-url>
cd realstate/fontend
npm install
```

### 3. Local Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Boot Dev Server
```bash
# Launch Next.js dev server on port 3000
npm run dev
```

---

## ⚙️ Available Scripts

Execute the following commands in the project directory:

* `npm run dev` - Launches the Next.js development server using **Turbopack** compilation.
* `npm run build` - Compiles the project for deployment.
* `npm start` - Launches the built production Next.js instance.
* `npm run lint` - Runs ESLint code-quality analyses.

---

## 🎨 Design & Styling Guidelines

* **Harmonious Color Archetypes**: Sleek dark slate (`#0F172A`), rich gold highlights (`#F59E0B`), and vibrant emerald green (`#0F6E56`).
* **Hover-State Transitions**: Interactive buttons use `transition-all duration-200 hover:-translate-y-[1px]` for responsive micro-interactions.
* **Component Outlines**: Card elements use border styles `#E2E8F0` and `rounded-2xl` corners.
* **Skeleton Loaders**: Premium UI blocks render Tailwind CSS `animate-pulse` gradient blocks to optimize perceived performance during loading states.

---
> Made with ❤️ for the Pakistani property market.
