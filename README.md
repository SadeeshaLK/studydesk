# 📚 StudyDesk – Your Smart Study Partner

A modern full-stack university quiz and assessment platform built with React, Node.js, Express, and MongoDB.

![StudyDesk](https://img.shields.io/badge/StudyDesk-v1.0-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Node](https://img.shields.io/badge/Node.js-Express-339933) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)

---

## ✨ Features

### 🎓 Student
- Dashboard with quiz stats (quizzes taken, average score, pass rate)
- Browse and attempt available quizzes
- Timer countdown with auto-submit
- One question per page with navigation panel
- Multiple question types: MCQ, True/False, Short Answer
- View detailed results with score breakdown
- Results history

### 👨‍🏫 Lecturer
- Create, edit, and delete quizzes
- Dynamic question builder (MCQ, True/False, Short Answer)
- Publish/unpublish quizzes
- View student submissions
- Analytics dashboard (average score, highest score, pass rate, attempt count)
- Student list with performance stats

### 🔐 Authentication
- JWT-based auth with role-based access control
- Secure password hashing (bcrypt)
- Protected routes

### 🎨 UI/UX
- Ant Design component library
- Dark mode toggle
- Multi-language support (English, Sinhala, Tamil)
- Responsive design (desktop + mobile)
- Animated gradient auth pages
- Soft shadows, rounded cards, modern typography (Inter)

### 🛡️ Anti-Cheat
- Tab switch detection with warning modal
- Tab switch count recorded in submissions
- Optional fullscreen enforcement

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Setup

```bash
cd StudyDesk
```

### 2. Configure Environment

Edit `server/.env` and replace `<db_password>` with your actual MongoDB Atlas password:

```env
MONGODB_URI=mongodb+srv://sadeeshaseneviratne_db_user:YOUR_PASSWORD@studydesk.azyr5we.mongodb.net/studydesk?retryWrites=true&w=majority&appName=studydesk
```

### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Seed Sample Data

```bash
cd server
npm run seed
```

This creates:
- **Lecturer**: `lecturer@studydesk.com` / `password123`
- **Student**: `student@studydesk.com` / `password123`
- **Student**: `kavindu@studydesk.com` / `password123`
- 3 sample quizzes with questions

### 5. Start Development Servers

```bash
# Terminal 1 - Backend (port 4000)
cd server
npm run dev

# Terminal 2 - Frontend (port 3000)
cd client
npm run dev
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
StudyDesk/
├── client/                    # React + Ant Design Frontend
│   ├── src/
│   │   ├── api/               # Axios API service
│   │   ├── components/        # Layout, Common components
│   │   ├── contexts/          # Auth, Theme contexts
│   │   ├── pages/
│   │   │   ├── Auth/          # Login, Register
│   │   │   ├── Student/       # Dashboard, Quiz, Results
│   │   │   └── Lecturer/      # Dashboard, Quiz Editor, Submissions
│   │   ├── i18n.js            # Multi-language config
│   │   ├── App.jsx            # Routes & providers
│   │   └── index.css          # Global styles & theming
│   └── vite.config.js
│
├── server/                    # Node.js + Express Backend
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Auth, Quiz, Submission logic
│   ├── middleware/auth.js     # JWT auth & role middleware
│   ├── models/                # User, Quiz, Submission schemas
│   ├── routes/                # API route definitions
│   ├── seeds/seed.js          # Sample data seeder
│   └── server.js              # Express entry point
│
└── README.md
```

---

## 🔗 API Routes

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get profile |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quizzes` | Create quiz (lecturer) |
| GET | `/api/quizzes/my-quizzes` | Lecturer's quizzes |
| GET | `/api/quizzes/student/available` | Available quizzes (student) |
| GET | `/api/quizzes/student/:id/attempt` | Get quiz for attempt |
| PUT | `/api/quizzes/:id` | Update quiz |
| DELETE | `/api/quizzes/:id` | Delete quiz |
| PATCH | `/api/quizzes/:id/publish` | Toggle publish |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions` | Submit quiz |
| GET | `/api/submissions/my-results` | Student results |
| GET | `/api/submissions/student-stats` | Student dashboard stats |
| GET | `/api/submissions/dashboard-stats` | Lecturer dashboard stats |
| GET | `/api/submissions/quiz/:quizId` | Quiz submissions (lecturer) |
| GET | `/api/submissions/analytics/:quizId` | Quiz analytics (lecturer) |

---

## 🎨 UI Style Guide

| Property | Value |
|----------|-------|
| Primary Color | `#1677ff` |
| Font | Inter (Google Fonts) |
| Border Radius | 8-16px |
| Shadows | Soft, layered |
| Dark Mode | Full support |

---

## 📝 License

MIT License - Built with ❤️ as StudyDesk
