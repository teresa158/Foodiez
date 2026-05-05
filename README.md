# Foodiez – Orders Module

## 🚀 Setup & Run

### 1. Install JSON Server (if not already installed)
```bash
npm install -g json-server
```

### 2. Start the backend API
```bash
json-server --watch db.json --port 3000
```
Your API will be available at: http://localhost:3000

### 3. Open the app
Open `orders.html` in your browser (or use Live Server in VS Code).

---

## 📁 File Structure
```
foodiez/
├── db.json          ← JSON Server database (orders + menu + settings)
├── orders.html      ← Orders Management page (your task)
└── README.md
```

---

## ✅ Features Implemented (Orders Section)

| Feature | Status |
|---|---|
| Dynamic order cards from API | ✅ |
| Filter tabs (All / Pending / Accepted / Preparing / Completed / Rejected) | ✅ |
| Create Order modal with menu item selection | ✅ |
| POST to API → instant DOM update | ✅ |
| Status progression buttons (Accept / Start Prep / Complete) | ✅ |
| Edit Order modal (name, table, status) via PATCH | ✅ |
| Delete order via DELETE + confirm | ✅ |
| Loading skeletons while fetching | ✅ |
| Error state (server unreachable) | ✅ |
| Empty state (no orders for filter) | ✅ |
| Search bar (filter by name or item) | ✅ |
| Toast notifications | ✅ |
| Count badges on filter tabs | ✅ |
| Responsive grid layout | ✅ |

---

## 🔌 API Endpoints Used

| Method | Endpoint | Usage |
|---|---|---|
| GET | /orders | Load all orders |
| GET | /menu | Load menu items |
| POST | /orders | Create new order |
| PATCH | /orders/:id | Update status or edit |
| DELETE | /orders/:id | Delete order |

---

## 🎨 Tech Stack
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript ES6+
- Fetch API
- JSON Server