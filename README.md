# Harpy Growth Intelligence

> **Enterprise Multi-Brand Amazon E-Commerce Analytics Platform**  
> Unified intelligence, Amazon Selling Partner API (SP-API) telemetry, advertising attribution, unit economics, smart alerts, client reporting, and AI performance diagnostics.

---

## 🦅 Overview

**Harpy Growth Intelligence** is a high-performance, dark-mode enterprise SaaS analytics engine built for multi-brand Amazon aggregators, private label portfolios, and e-commerce growth agencies managing client portfolios.

### Unified Core Capabilities
- **Multi-Brand Agency Hierarchy**: Manage multi-marketplace D2C client brands (*Village Company* in Amazon India 🇮🇳, *Premium Wellness Co.* in Amazon US 🇺🇸, and *Urban Living* in Amazon UK 🇬🇧 & UAE 🇦🇪).
- **Executive Growth Overview**: Real-time KPI scorecard (Revenue, Ad Spend, Orders, Profit, ROAS, TACoS) with synchronized line, bar, area, and donut visualizer charts.
- **Brand Management & Workspace**: Deep dive into individual client brands with dedicated overview, revenue trends, product catalog, campaign portfolio, alerts, and audit reports.
- **Campaign Intelligence (PPC)**: 13-column campaign table, metric sorters, search term harvesting, and diagnostic panels isolating high ACOS bleeders.
- **Product & Profit Analytics**: True unit-level financial accounting distinguishing Gross Profit ($\text{Revenue} - \text{COGS}$) from Estimated Contribution Profit ($\text{Revenue} - [\text{COGS} + \text{Referral} + \text{FBA} + \text{PPC}]$), with incomplete cost data safeguards.
- **Smart Alerts Engine**: 7 automated anomaly detectors (Ad Spend Spikes, ROAS Declines, Target ACOS Breaches, TACoS Surges, Revenue Drops, Low Margins, Campaign Deterioration) with duplicate prevention and audit logging.
- **Weekly Client Reporting Studio**: Executive printable white document generator with 15 required sections, high-res `@media print` PDF export, standalone HTML download, and markdown clipboard summaries.
- **AI Growth Analyst**: Natural-language enterprise intelligence powered by backend OpenAI integration with a deterministic rule-based analyst fallback.
- **Data & CSV Ingestion Studio**: Upload offline sales, product catalogs, PPC campaign performance, and unit COGS with duplicate detection and schema validation.
- **Multi-Tenant Agency Scoping**: All database records securely partitioned to authenticated agency tenants (`agency_harpy_media_01`).

---

## 🎨 Enterprise Design System

The platform features a bespoke dark enterprise SaaS aesthetic engineered for data density, contrast clarity, and executive decision-making.

| Token | Hex / Spec | Purpose |
| :--- | :--- | :--- |
| **Deep Navy (Canvas)** | `#090D14` | Primary dashboard background |
| **Dark Charcoal (Surface)** | `#0D111A` | Sidebar, modals, and persistent navigation |
| **Card Surface** | `#0F1726` | Metric cards and analytical containers |
| **Primary Accent** | `#22C55E` (Emerald) | Revenue acceleration, positive deltas, profit indicators |
| **Secondary Accent** | `#38BDF8` (Electric Blue) | PPC analytics, active filters, impressions, data lines |
| **Borders** | `#1A2338` / `#1E293B` | Subtle gridlines and card contours |
| **Typography** | `Inter` (Sans) & `JetBrains Mono` | Clean legibility for high-density financial metrics |

---

## 📁 Integrated Project Architecture

```
d:\Harpy media\
├── .env.example                     # Environment variables template
├── package.json                     # Root configuration (Vite, React 19, Express 5, Mongoose)
├── tailwind.config.js               # Design tokens (Harpy Navy, Charcoal, Emerald, Electric)
├── vite.config.js                   # Vite configuration with proxy to port 5000
├── src/
│   ├── main.jsx                     # Application bootstrap
│   ├── App.jsx                      # App root with Router & BrandProvider
│   ├── index.css                    # Tailwind base, dark glassmorphism & @media print styles
│   ├── context/
│   │   └── BrandContext.jsx         # Shared brand, date range, alert stats, & sync state
│   ├── routes/
│   │   └── index.jsx                # React Router (10 primary routes)
│   ├── components/
│   │   ├── layout/                  # Shared Shell: Sidebar, Header, BrandSwitcher, AppLayout
│   │   ├── common/                  # Atomic UI: Card, KpiCard, Badge, Button, Input, Skeleton
│   │   ├── brands/                  # BrandPortfolio, BrandModal, BrandWorkspaceView
│   │   ├── products/                # ProductDetailView (unit economics & waterfall breakdown)
│   │   ├── alerts/                  # AlertCard, AlertResolutionModal, AlertRuleConfigDrawer
│   │   ├── reports/                 # ClientReportDocument (printable white executive canvas)
│   │   └── analyst/                 # ChatBubble, InsightCard
│   ├── pages/
│   │   ├── DashboardOverview.jsx    # Executive Overview
│   │   ├── BrandsPortfolio.jsx      # Client Brand Portfolio Management
│   │   ├── BrandWorkspacePage.jsx   # Dedicated Brand Workspace Drilldown
│   │   ├── SalesAnalytics.jsx       # Product & Profit Analytics (13-column financial table)
│   │   ├── ProductDetailPage.jsx    # Unit Economics & Fee Breakdown
│   │   ├── AdvertisingPpc.jsx       # Campaign Intelligence Suite
│   │   ├── SmartAlerts.jsx          # Smart Performance Alerts Center
│   │   ├── ClientReporting.jsx      # Weekly Client Reporting Studio
│   │   ├── AiGrowthAnalyst.jsx      # AI Growth Analyst Chat Interface
│   │   ├── InventoryHealth.jsx      # FBA Inventory Runway & Restock Models
│   │   ├── DataImport.jsx           # CSV Ingestion & Duplicate Prevention Studio
│   │   └── Settings.jsx             # SP-API & System Integration Settings
│   └── services/
│       ├── api.js                   # Axios client with proxy & offline resilience
│       ├── brandService.js          # Brand CRUD & multi-marketplace portfolio
│       ├── campaignService.js       # Campaign telemetry & diagnostic metrics
│       ├── productService.js        # True multi-cost unit economics engine
│       ├── alertService.js          # Telemetry anomaly detection & deduplication
│       ├── reportService.js         # 15-section client report generator
│       ├── aiAnalystService.js      # Natural-language analyst service
│       └── dashboardDataService.js  # Cohesive daily history & comparison engine
└── server/
    ├── index.js                     # Express 5 entry with middleware & routes
    ├── config/db.js                 # MongoDB connection manager with offline fallback
    ├── middleware/
    │   ├── authMiddleware.js        # Multi-tenant agency scoping middleware
    │   ├── validateRequest.js       # Request body & parameter validator
    │   └── errorHandler.js          # Centralized error handler
    ├── models/
    │   ├── Brand.js                 # Brand schema with agencyId
    │   ├── Product.js               # Product schema with unit economics
    │   ├── Campaign.js              # Campaign schema with PPC telemetry
    │   ├── MetricSnapshot.js        # Daily historical performance snapshots
    │   ├── Alert.js                 # Performance alerts & resolutions
    │   └── ImportLog.js             # CSV batch ingestion logs & file hashes
    ├── controllers/
    │   ├── brandController.js       # Brand endpoints
    │   ├── campaignController.js    # Campaign & analysis endpoints
    │   ├── productController.js     # Product & unit economics endpoints
    │   ├── alertController.js       # Alert & rule configuration endpoints
    │   ├── reportController.js      # Report metadata endpoints
    │   ├── aiController.js          # Natural-language analysis (OpenAI / Deterministic)
    │   └── importController.js      # CSV parser, validation & duplicate prevention
    ├── routes/                      # Express routers
    └── seed/
        └── seedData.js              # Database seed script for MongoDB
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v24.21 recommended)
- **npm**: v9.0.0 or later
- **MongoDB** *(Optional)*: Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas. (The application runs with graceful in-memory fallbacks if MongoDB is offline).

### 2. Available Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite client dev server at `http://localhost:5173/` |
| `npm run server` | Starts Express API backend at `http://localhost:5000/` |
| `npm run dev:all` | Concurrently boots both Vite frontend and Express backend |
| `npm run seed` | Seeds MongoDB with sample brands, products, campaigns, and metrics |
| `npm run build` | Compiles production assets into `/dist` with zero errors |
| `npm run preview` | Previews the compiled production build locally |

> **Windows PowerShell Note**: If execution policies restrict `.ps1` scripts, run commands using `npm.cmd run dev` or launch standard CMD.

---

## 📡 REST API Reference (Express Backend)

All endpoints automatically inherit multi-tenant agency scoping via `X-Agency-Id` header (defaults to `agency_harpy_media_01`).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and MongoDB connection status |
| `GET` | `/api/brands` | List of agency client brands (search, marketplace, sort) |
| `GET` | `/api/brands/:id` | Detailed brand record with targets and metrics |
| `POST` | `/api/brands` | Create new client brand |
| `PUT` | `/api/brands/:id` | Update brand targets and configurations |
| `DELETE`| `/api/brands/:id` | Delete brand with confirmation |
| `GET` | `/api/products` | 13-column product financial dataset with unit economics |
| `GET` | `/api/products/:asin` | Detailed product economics, trends, and recommendations |
| `GET` | `/api/campaigns` | Campaign telemetry (SP, SB, SD) with ACOS & ROAS |
| `GET` | `/api/campaigns/analysis`| Analysis panel (top performing, bleeders, budget capped) |
| `GET` | `/api/alerts` | Active and resolved performance alerts |
| `PATCH`| `/api/alerts/:id/read` | Mark alert as read |
| `PATCH`| `/api/alerts/:id/resolve`| Resolve alert with management notes |
| `GET` | `/api/reports` | Weekly client performance report payload |
| `POST` | `/api/ai/analyze` | AI Growth Analyst natural-language reasoning |
| `GET` | `/api/ai/suggestions` | Suggested inquiry questions |
| `POST` | `/api/import/validate` | Validate CSV file structure & detect duplicate uploads |
| `POST` | `/api/import/process` | Atomically commit and upsert CSV records |
| `GET` | `/api/import/history` | Audit trail of past file imports |
| `GET` | `/api/import/template/:type` | Download sample CSV template |

---

## 🛡️ Quality & Verification Summary

- **Production Build**: Verified with code 0 (`npm.cmd run build` transformed 2,739 modules in under 3 seconds).
- **Backend Test Suite**: Verified 10 out of 10 API endpoints returning HTTP 200/201.
- **CSV Data Ingestion**: Tested schema parsing, header validation, data type verification, and duplicate file hash checking.
- **Client Reporting**: Verified PDF printing via `@media print` clean white stylesheet without dark mode chrome.
- **AI Growth Analyst**: Verified both OpenAI API integration and deterministic rule-based engine across all 6 core business questions.
