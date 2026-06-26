# Restro SaaS - Enterprise Multi-Tenant Restaurant QR Ordering System

An enterprise-grade, production-ready, white-label Multi-Tenant and Multi-Branch Restaurant QR Ordering SaaS platform built using **Next.js 15 (App Router)**, **Express**, **Socket.IO**, and **MongoDB**.

---

## 🏗️ Architecture Overview

The codebase is split into two packages:
- **`backend/`**: Express API & Real-time WebSockets Server. Operates database models, rate limits, mail triggers, image uploads, and websocket rooms.
- **`frontend/`**: Next.js 15 Web App client. Handles client-side static rendering, user session storage via NextAuth, persisted Zustand cart states, and real-time waiter/KDS alerts.

---

## 📂 Project Structure

```
.
├── backend/                  # REST API & WebSockets server
│   ├── config/               # DB connections
│   ├── middleware/           # RBAC and JWT validators
│   ├── models/               # 20 Mongoose Schemas (Tenant isolated)
│   ├── routes/               # API Router bindings
│   ├── services/             # Cloudinary & Nodemailer helpers
│   ├── scripts/              # DB Seeding triggers
│   ├── Dockerfile
│   └── server.js             # Main server execution
│
├── frontend/                 # Client UI (Next.js 15 App Router)
│   ├── app/                  # Next.js pages & auth hooks
│   ├── components/           # UI elements (buttons, inputs, select)
│   ├── hooks/                # Socket connections
│   ├── lib/                  # Fetch wrappers & session builders
│   ├── providers/            # NextAuth & TanStack query wrappers
│   ├── store/                # Persisted Zustand states (Carts)
│   └── Dockerfile
│
├── docker-compose.yml        # Orchestrator
└── README.md
```

---

## 🔐 Multi-Tenant Database Isolation

Tenant isolation is implemented at the database query layer:
1. Every collection (Users, Categories, MenuItems, Tables, Orders, Coupons, Settings) carries a `restaurantId` (and optionally a `branchId`).
2. Authentication sessions resolve to an Express-signed JWT.
3. Every REST call unpacks this JWT and executes query bounds using:
   `{ restaurantId: req.user.restaurantId }` or `{ branchId: req.user.branchId }`
This guarantees that tenants can never access or modify data belonging to other restaurants.

---

## 🚀 Getting Started

### 1. Configure Environments
Create a `.env` file in the root directory (you can copy `.env.example` as a template):
```bash
cp .env.example .env
```

### 2. Local Installation & Development

Run the services concurrently or individually:

#### **Backend Setup**
```bash
cd backend
npm install
# Seed the initial plans and settings
npm run seed
# Start backend on http://localhost:5000
npm run dev
```

#### **Frontend Setup**
```bash
cd frontend
npm install
# Start Next.js client on http://localhost:3000
npm run dev
```

---

## 🐳 Docker Deployment

To spin up the entire stack, including a localized MongoDB container:
```bash
docker-compose up --build
```
This boots:
- **MongoDB** on `mongodb://localhost:27017`
- **Express Backend API** on `http://localhost:5000`
- **Next.js Client App** on `http://localhost:3000`

---

## 🔑 Default Roles & Logins
After database seeding (`npm run seed` inside `backend/`), the following default credentials are created:

1. **Super Admin**:
   - Email: `superadmin@restrosaas.com`
   - Password: `password123`
   - Role: `SUPER_ADMIN`
   - Access: Super Admin dashboard to manage restaurants and plans.

2. **Restaurant Admin (Tenant)**:
   - Email: `admin@thegourmet.com`
   - Password: `password123`
   - Role: `RESTAURANT_ADMIN`
   - Access: Restaurant console to configure menu, tables, coupons, and staff.

---

## 🛎️ Core SaaS User Flows

1. **Super Admin Dashboard**: Toggle tenant status (Active/Suspended), modify subscription endings, assign white-label custom domains, and configure pricing plans.
2. **Restaurant Console**: Manage food categories, customize items with variants/addons, register wait staff accounts, set localized tax rates, and generate table scan QR signs.
3. **Live Order KDS Screen**: Real-time kitchen tickets list with ingredient checkboxes, sound alerts, status change buttons (Start Cooking, Mark Ready), connected via WebSockets.
4. **Customer Dine-in QR Portal**: Seated customers scan a table QR code, input details, browse category menus, select addons, apply coupon validation, select payments (UPI/Cash), and place orders.
5. **Live Tracking Monitor**: Customer tracks their dining ticket progress (Pending -> Cooking -> Ready -> Completed) in real-time, matching waiter console updates.
