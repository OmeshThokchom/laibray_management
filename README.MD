# 📚 Lumina Library Management System

A premium, modern library management system built with **Python (Flask)** and **Vanilla JS**. Designed to look like a high-end macOS application with glassmorphism, smooth animations, and a robust feature set.

![Lumina Library](https://ui-avatars.com/api/?name=Lumina&background=0a84ff&color=fff&size=128)

---

## 🚀 Features

- **Premium UI/UX**: macOS Big Sur inspired design with glassmorphism, dark mode, and smooth transitions.
- **Dashboard**: Real-time statistics (Total Books, Active Issues, Overdue) and interactive charts.
- **Authentication**: Secure login system with a macOS-style lock screen.
  - **Default Admin**: `admin` / `admin`
- **Inventory Management**: Add, edit, and track books with auto-generated IDs.
- **Member Management**: Manage library members and view their history.
- **Circulation**: Issue and return books with real-time stock updates.
- **Smart Search**: Instant, client-side search for books and members.
- **Deep Linking**: Shareable URLs for specific views (e.g., `/books`, `/members`).

---

## 🛠️ Tech Stack

- **Backend**: Python 3 (Flask)
- **Database**: JSON Files (Simple, portable, human-readable)
- **Frontend**: HTML5, CSS3 (Custom Glassmorphism), Vanilla JavaScript
- **Icons**: Phosphor Icons
- **Charts**: Chart.js

---

## 💻 Installation Guide (Windows - Fresh Start)

Follow these steps to set up the project on a fresh Windows machine.

### 1. Prerequisites

1.  **Install Python**:
    - Download Python from [python.org](https://www.python.org/downloads/).
    - **IMPORTANT**: During installation, check the box **"Add Python to PATH"**.
2.  **Install Git**:
    - Download Git from [git-scm.com](https://git-scm.com/download/win).
    - Install with default settings.

### 2. Clone the Repository

Open **Command Prompt** (cmd) or **PowerShell** and run:

```bash
# Clone the project
git clone https://github.com/OmeshThokchom/laibray_management.git

# Navigate into the folder
cd laibray_management
```

### 3. Set Up Virtual Environment (Recommended)

It's best practice to use a virtual environment to keep dependencies isolated.

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
```
*(You should see `(venv)` appear at the start of your command line)*

### 4. Install Dependencies

```bash
pip install flask
```

### 5. Run the Application

```bash
python app.py
```

You should see output like:
` * Running on http://127.0.0.1:5000`

### 6. Login

1.  Open your browser and go to `http://localhost:5000`.
2.  You will see the Lock Screen.
3.  **Username**: `admin`
4.  **Password**: `admin`

---

## 📂 Project Structure

```text
laibray_management/
│
├── app.py                  # Flask Server & API Routes
├── data_manager.py         # JSON Database Handler
│
├── data/                   # Data Storage
│   ├── books.json
│   ├── members.json
│   └── issued.json
│
├── static/                 # Frontend Assets
│   ├── css/
│   │   └── style.css       # Glassmorphism Styles
│   ├── js/
│   │   └── script.js       # SPA Logic, Auth, Charts
│   └── index.html          # Main Application File
│
└── README.md               # Documentation
```

---

## ⌨️ Shortcuts

- **Ctrl + L**: Log Out instantly.

---

Made with ❤️ by Omesh Thokchom
