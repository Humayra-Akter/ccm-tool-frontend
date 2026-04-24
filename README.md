A CCM web portal for one end user, where the user logs in, lands on a dashboard, monitors control performance, and opens dynamic Power BI outputs for selected controls/KPIs.

# Core purpose

A business-facing Control Monitoring & Compliance solution that combines:

- application UI
- KPI/control summaries
- exception monitoring
- file/data upload
- dynamic Power BI report viewing

# Main screens

- Login / Register
- Dashboard
- KPI Overview
- Exception Tracking
- Upload Center
- Settings

# Main workflow

- User opens login page
- Demo sign-in / register
- User enters dashboard
- Dashboard shows control summary, status cards, charts, and tables
- User moves to KPI / Exception pages
- User selects a control
- Matching Power BI report opens
- User can upload source data for updates behind the scenes

# KPIs / controls to support

- Early Payments
- Duplicate Payments
- Dormant PO
- Two Way Match
- New Undelivered POs
- Aged Open Advances
- Invoice Split Bypass
- Delay in invoicing was also mentioned earlier, so KPI scope must be finalized

# Features to implement

- Demo authentication
- Protected routing
- Collapsible sidebar
- Top navbar
- Dashboard status cards
- KPI health summary
- Trend chart
- Recent exceptions table
- Entity-wise score table
- KPI page with Power BI embed
- Exception page
- Upload page
- Settings page
- Logout
- Filters and export actions
- Responsive UI
- Reusable components

# Backend / system features planned

- Node.js backend
- Prisma ORM
- DB tables for control data / KPI outputs
- Upload handling
- Power BI integration
- Dynamic report mapping by KPI/control
- Future real authentication

# What matters most

- business-solution level UI
- clean navigation
- correct routing
- dynamic KPI/report flow
- reusable component structure
- strong dashboard experience, not just a report viewer

src/
├── styles/
│ └── theme.css
│ └── ui.js
│
├── components/ ← ALL reusable things here
│ ├── Sidebar.jsx
│ ├── Navbar.jsx
│ ├── KPICard.jsx
│ ├── Chart.jsx
│ ├── Table.jsx
│ ├── Pagination.jsx
│ ├── Filter.jsx
│ ├── FileUpload.jsx
│ ├── Loader.jsx
│ ├── Empty.jsx
│
├── pages/ ← actual screens
│ ├── Login.jsx
│ ├── Dashboard.jsx
│ ├── KPI.jsx
│ ├── Upload.jsx
│
├── services/ ← API calls
│ ├── api.js
│ ├── dashboard.js
│ ├── powerbi.js
│
├── layouts/
│ └── AppLayout.jsx
│
├── hooks/
│ ├── useFetch.js
│ └── usePagination.js
│
└── main.jsx
