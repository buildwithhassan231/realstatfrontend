# PropFind — Pakistan's #1 Property Platform

> A full-featured real estate web application built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.  
> Search, list, and manage properties across Pakistan — for buyers, agents, and admins.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Features](#features)
  - [Public Pages](#public-pages)
  - [Agent Dashboard](#agent-dashboard)
  - [Admin Panel](#admin-panel)
- [Authentication & Access Control](#authentication--access-control)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Key Components](#key-components)
- [Styling Conventions](#styling-conventions)

---

## Overview

PropFind is a modern property listing platform targeting the Pakistani real estate market.  
It supports three user roles — **Buyer**, **Agent**, and **Admin** — each with their own dedicated interface.

- **Buyers** browse and search properties, view details, and send inquiries.
- **Agents** manage their own listings, track inquiries, and update their profile.
- **Admins** have full oversight: approve/reject listings, manage users, handle all inquiries, and control featured properties.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 16 (App Router)             |
| UI Library   | React 19                            |
| Styling      | Tailwind CSS v4                     |
| Auth         | Context API + localStorage          |
| Language     | JavaScript (JSX)                    |
| Linting      | ESLint (eslint-config-next)         |
| Build Tool   | Next.js built-in (Turbopack)        |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout (AuthProvider, fonts)
│   ├── globals.css             # Global styles
│   ├── not-found.js            # 404 page
│   ├── login/                  # /login
│   ├── register/               # /register
│   ├── properties/             # /properties (listing + detail)
│   │   └── [id]/               # /properties/:id
│   ├── agents/                 # /agents (listing + profile)
│   │   └── [id]/               # /agents/:id
│   ├── projects/               # /projects
│   ├── dashboard/              # Agent dashboard (protected)
│   │   ├── page.js             # Overview
│   │   ├── listings/           # My listings
│   │   ├── add/                # Add new property
│   │   ├── edit-property/[id]/ # Edit a property
│   │   ├── inquiries/          # Agent's inquiries
│   │   └── profile/            # Agent profile settings
│   └── admin/                  # Admin panel (admin-only)
│       ├── page.js             # Admin overview
│       ├── users/              # Manage users
│       ├── properties/         # Manage all properties
│       ├── inquiries/          # Manage all inquiries
│       ├── categories/         # Manage categories
│       └── settings/           # Platform settings
│
├── components/
│   ├── Navbar.jsx              # Top navigation bar
│   ├── Hero.jsx                # Homepage hero section
│   ├── Categories.jsx          # Category cards
│   ├── FeaturedProperties.jsx  # Featured listings grid
│   ├── Stats.jsx               # Platform statistics
│   ├── HowItWorks.jsx          # Steps section
│   ├── Footer.jsx              # Site footer
│   ├── PropertyCard.jsx        # Reusable property card
│   ├── AgentsListingPage.jsx   # Agents directory page
│   ├── AgentProfilePage.jsx    # Individual agent page
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── detail/                 # Property detail page components
│   │   ├── PropertyDetailPage.jsx
│   │   ├── PropertyGallery.jsx
│   │   ├── PropertySpecs.jsx
│   │   ├── PropertyAmenities.jsx
│   │   ├── PropertyLocation.jsx
│   │   ├── AgentSidebar.jsx
│   │   └── SimilarProperties.jsx
│   ├── listing/                # Property listing page components
│   │   ├── PropertyListingPage.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── ListingTopBar.jsx
│   │   └── Pagination.jsx
│   ├── dashboard/              # Agent dashboard components
│   │   ├── AgentDashboard.jsx
│   │   ├── AgentDashboardLayout.jsx
│   │   ├── DashboardSidebar.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── ListingsTable.jsx
│   │   ├── RecentInquiries.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── add/                # Add/Edit property form components
│   │   └── inquiries/          # Agent inquiries page
│   ├── admin/                  # Admin panel components
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── ManagePropertiesPage.jsx
│   │   ├── ManageUsersPage.jsx
│   │   └── ManageInquiriesPage.jsx
│   ├── projects/               # Projects / off-plan section
│   └── guards/
│       └── PrivateRoute.jsx    # Auth + role guards
│
├── context/
│   └── AuthContext.jsx         # Global auth state
│
└── data/
    └── agents.js               # Static agent data (mock)
```

---

## Pages & Routes

| Route                          | Access        | Description                              |
|-------------------------------|---------------|------------------------------------------|
| `/`                            | Public        | Homepage with hero, featured, categories |
| `/properties`                  | Public        | Browse all properties with filters       |
| `/properties/:id`              | Public        | Full property detail page                |
| `/agents`                      | Public        | Browse all agents                        |
| `/agents/:id`                  | Public        | Agent profile with their listings        |
| `/projects`                    | Public        | Off-plan / new projects section          |
| `/login`                       | Public        | Login form                               |
| `/register`                    | Public        | Registration form                        |
| `/dashboard`                   | Agent only    | Agent dashboard overview                 |
| `/dashboard/listings`          | Agent only    | View & manage own listings               |
| `/dashboard/add`               | Agent only    | Add a new property listing               |
| `/dashboard/edit-property/:id` | Agent only    | Edit an existing listing                 |
| `/dashboard/inquiries`         | Agent only    | View all buyer inquiries                 |
| `/dashboard/profile`           | Agent only    | Edit agent profile                       |
| `/admin`                       | Admin only    | Admin overview with charts & stats       |
| `/admin/users`                 | Admin only    | Manage all users                         |
| `/admin/properties`            | Admin only    | Manage all property listings             |
| `/admin/inquiries`             | Admin only    | Manage all buyer inquiries               |
| `/admin/categories`            | Admin only    | Manage property categories               |
| `/admin/settings`              | Admin only    | Platform settings                        |

---

## Features

### Public Pages

**Homepage**
- Hero section with search bar
- Property category cards (House, Apartment, Plot, Villa, Commercial)
- Featured properties grid
- Platform statistics (users, listings, cities, agents)
- How It Works steps
- Footer with links

**Property Listing (`/properties`)**
- Grid of property cards with emoji thumbnails
- Filter sidebar: type, city, price range, bedrooms, purpose (sale/rent)
- Sort options
- Pagination
- Each card shows: price, title, location, beds, baths, area, purpose badge, featured badge, wishlist toggle

**Property Detail (`/properties/:id`)**
- Full image gallery
- Property specs (beds, baths, area, floor)
- Amenities list
- Location map placeholder
- Similar properties
- Agent contact sidebar with inquiry form

**Agents Directory (`/agents`)**
- Agent cards with name, specialty, listings count, location
- Click through to individual agent profile

**Projects (`/projects`)**
- Off-plan / new development listings
- Register Interest modal

---

### Agent Dashboard

Protected behind authentication. Only accessible to users with `role: "agent"`.

| Feature              | Details                                                    |
|----------------------|------------------------------------------------------------|
| Overview             | Stats: total listings, active, sold/rented, total inquiries |
| My Listings          | Table with search, status filter, edit and delete actions  |
| Add Property         | Multi-section form with title, type, price, location, description, amenities, image upload |
| Edit Property        | Pre-filled form to update any existing listing             |
| Inquiries            | Cards with buyer details, message, property thumbnail, mark read/responded actions |
| Profile              | Update name, phone, bio, profile photo                     |

---

### Admin Panel

Protected behind authentication. Only accessible to users with `role: "admin"`.

**Overview (`/admin`)**
- 4 stat cards: Total Users, Total Properties, Total Inquiries, Revenue
- Bar chart — properties listed per month
- Line chart — user registrations per month
- Quick action buttons: Add Featured, Block User, Approve Pending, Export Report
- Recent Activity table with per-row approve action

**Manage Properties (`/admin/properties`)**
- Full table of all properties on the platform
- Search by title or agent name
- Filter by: property type, status (available / pending / sold / rented), city
- Pending properties highlighted with amber background
- Pending approval banner with "Review Now" shortcut
- Per-row actions:
  - 👁️ View live listing
  - ✓ Approve (pending only)
  - ✕ Reject (pending only)
  - ⭐ Toggle Featured on/off
  - 🗑️ Delete with confirmation modal
- Pagination (6 per page)

**Manage Users (`/admin/users`)**
- Table of all registered users (buyers, agents, admins)
- Search by name or email
- Filter by role and status
- Bulk select with block/delete actions
- Per-row actions:
  - 👁️ View profile
  - 🚫 Block / ✅ Unblock
  - ⬆️ Promote buyer to agent
  - 🗑️ Delete (non-admin users only)
- All destructive actions require confirmation modal
- Pagination (6 per page)

**Manage Inquiries (`/admin/inquiries`)**
- Full table of all buyer inquiries across all agents
- Stats row: Total, Unread, Read, Responded
- Unread alert banner linking to unread tab
- Tab filters: All / Unread / Read / Responded
- Search by buyer name, email, or property
- Filter by agent
- Per-row actions:
  - 👁️ Mark as Read (unread only)
  - ✅ Mark as Responded
  - 🗑️ Delete with confirmation modal
- Expandable message preview
- Pagination (5 per page)

---

## Authentication & Access Control

Auth state is managed globally via React Context and persisted in `localStorage`.

```js
// User object stored in localStorage as "propfind_user"
{
  name: "Hassan Ali",
  email: "hassan.ali@propfind.pk",
  role: "admin"  // "buyer" | "agent" | "admin"
}
```

**Route Guards** (`src/components/guards/PrivateRoute.jsx`):

- `<PrivateRoute>` — redirects to `/login` if no user session
- `<AdminRoute>` — redirects to `/` if user is not an admin

Both guards show a spinner while auth state is loading from localStorage.

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone <repo-url>
cd fontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**To access the admin panel**, log in with a user that has `role: "admin"` set in localStorage:

```js
// Open browser console and run:
localStorage.setItem("propfind_user", JSON.stringify({
  name: "Super Admin",
  email: "admin@propfind.pk",
  role: "admin"
}))
// Then refresh the page and navigate to /admin
```

---

## Scripts

| Command         | Description                              |
|----------------|------------------------------------------|
| `npm run dev`   | Start development server (localhost:3000) |
| `npm run build` | Build for production                     |
| `npm start`     | Start production server                  |
| `npm run lint`  | Run ESLint                               |

---

## Key Components

### `PropertyCard.jsx`
Reusable card used on the homepage and listing page. Accepts a `property` prop with: `id`, `title`, `price`, `priceUnit`, `location`, `beds`, `baths`, `area`, `emoji`, `gradient`, `purpose`, `featured`, `liked`.

### `Pagination.jsx`
Generic pagination component. Props: `currentPage`, `totalPages`, `onPageChange`.

### `AuthContext.jsx`
Provides `user`, `loading`, `login(userData)`, `logout()` to the entire app.

### `AdminSidebar.jsx`
Dark sidebar for all admin pages with active link highlighting and logout.

### `DashboardSidebar.jsx`
Sidebar for agent dashboard pages with role-based navigation.

---

## Styling Conventions

- All colors use hex values from a consistent design palette:
  - Primary gold: `#F59E0B`
  - Dark navy: `#0F172A`
  - Brand green: `#0F6E56`
  - Body text: `#1E293B`
  - Muted: `#94A3B8`
  - Borders: `#E2E8F0`
  - Background: `#F8FAFC`
- Rounded corners: `rounded-xl` (12px) or `rounded-2xl` (16px)
- All interactive elements have `transition-colors` or `transition-all`
- Mobile-first responsive layout using Tailwind breakpoints (`sm:`, `lg:`)
- Sticky sidebars on desktop, slide-in drawer on mobile

---

> Built with ❤️ for the Pakistani real estate market.
