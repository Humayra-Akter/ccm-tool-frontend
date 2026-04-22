I have to create a CCM website. The portal will have one end user, there will be a Power BI dashboard, and control outputs. SSO is not needed. 1st page will be registration/ login page, there will be 7 KPIs, they are 7 controls or tables, I have shared 2 screenshots of the existing project done by another vendor. so i need to up my game, also i shared a screenshot of the requirements now tell me what should be the workflow, i need to prepare a list of the requirements, reports or anything needed for this app. this is kinda app where a user will login and see dashboard, then another tab there will be a option to piick from any of the 7 KPIs ( Early Payments Duplicate Payments Dormant PO Two Way Match New Undelivered POs Aged Open Advances Invoice Split Bypass Delay in invoicing) after choosing any of them the corresponding power bi file will open. that power bi file is dynamic, should accept changes from behind the scenes those 7 kpis will be the table names in the db. i will create the platform with react vite, node js, prisma. what do you suggest?? what are the dynamics i should focus. how long it might take?? what shoulld be the color theme, help me to fix everything

src/
 ├── styles/
 │    └── theme.css
 │
 ├── components/        ← ALL reusable things here
 │    ├── Sidebar.jsx
 │    ├── Navbar.jsx
 │    ├── KPICard.jsx
 │    ├── Chart.jsx
 │    ├── Table.jsx
 │    ├── Pagination.jsx
 │    ├── Filter.jsx
 │    ├── FileUpload.jsx
 │    ├── Loader.jsx
 │    ├── Empty.jsx
 │
 ├── pages/             ← actual screens
 │    ├── Login.jsx
 │    ├── Dashboard.jsx
 │    ├── KPI.jsx
 │    ├── Upload.jsx
 │
 ├── services/          ← API calls
 │    ├── api.js
 │    ├── kpi.js
 │    ├── upload.js
 │    ├── powerbi.js
 │
 ├── layouts/
 │    └── AppLayout.jsx
 │
 ├── hooks/
 │    ├── useFetch.js
 │    └── usePagination.js
 │
 └── main.jsx