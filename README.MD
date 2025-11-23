# 📚 Library Management System (Premium Demo)

A "mid-level" library management system that looks like a million bucks but runs on **Python (Flask) + JSON**. 
Designed to be a killer demo: simple architecture, premium UI, and smooth flows.

---

## 🚀 Tech Stack

- **Backend**: Python (Flask)
  - Why? Lightweight, handles REST APIs easily, perfect for demos.
- **Database**: JSON Files (`books.json`, `members.json`, `issued.json`)
  - Why? No database setup required. Portable. Human-readable debugging.
- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JS
  - Why? Fast, no build steps, looks premium.
- **Extras**: Chart.js (for the dashboard stats).

---

## 💎 Core Features

1.  **Interactive Dashboard**: Live stats (Total Books, Active Issues, Overdue) + Charts.
2.  **Inventory Management**: Add/Edit books with auto-generated IDs.
3.  **Member Management**: Track members and their history.
4.  **Circulation**: 
    - **Issue Book**: Real-time stock check.
    - **Return Book**: Auto-calculation of fines (mock logic).
5.  **Search**: Instant filtering for books and members.

---

## 📂 System Structure

```text
library-demo/
│
├── app.py                  # Flask Application (API + Server)
├── data_manager.py         # Handles JSON read/writes (The "Database" Logic)
│
├── data/                   # The "Database"
│   ├── books.json
│   ├── members.json
│   └── issued.json
│
├── static/
│   ├── css/
│   │   └── style.css       # Premium Glassmorphism Styles
│   ├── js/
│   │   └── script.js       # SPA Logic & API Calls
│   └── index.html          # Single Page Application Entry
│
└── README.md
```

---

## 💾 Data Models (JSON)

### 1. `books.json`
```json
[
  {
    "id": 101,
    "title": "The Pragmatic Programmer",
    "author": "Andy Hunt",
    "category": "Tech",
    "total_copies": 5,
    "available_copies": 3
  }
]
```

### 2. `members.json`
```json
[
  {
    "id": "M-2024-001",
    "name": "Omesh Thokchom",
    "email": "omesh@example.com",
    "joined_date": "2024-01-15"
  }
]
```

### 3. `issued.json`
```json
[
  {
    "id": 5001,
    "book_id": 101,
    "member_id": "M-2024-001",
    "issue_date": "2025-11-20",
    "due_date": "2025-12-04",
    "status": "issued"  // or "returned"
  }
]
```

---

## 🎨 UI/UX Design Philosophy

- **Glassmorphism**: Translucent cards, blurred backgrounds, neon accents.
- **Single Page App (SPA)**: No page reloads. Smooth transitions between Dashboard, Books, and Members views.
- **Feedback**: Toast notifications for every action ("Book Added", "Return Successful").

---

## 🛠️ Setup & Run

1. **Install Flask**:
   ```bash
   pip install flask
   ```

2. **Run the App**:
   ```bash
   python app.py
   ```

3. **Open Browser**:
   Go to `http://localhost:5000` and enjoy the vibes.
