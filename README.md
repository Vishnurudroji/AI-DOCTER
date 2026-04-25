# 🏥 VitaCare – AI Powered Health Assistant

> Smart healthcare companion built with Next.js, Prisma, JWT Authentication, and Google Gemini AI.

VitaCare is a modern full-stack healthcare web application that helps users manage personal health records, medicines, and get AI-powered symptom guidance through a friendly chat assistant.

Designed as a real-world portfolio project for software engineering and AI product roles.

---

# 🚀 Live Demo

Try it link here:

```txt
https://your-app-url.vercel.app
```

---

# 📸 Screenshots

Add screenshots here:

![Home](./screenshots/home.png)

---

# ✨ Core Features

## 👤 User Management

* Secure Signup / Login
* JWT Authentication with Cookies
* Personalized User Sessions

## 🩺 Health Profile

* Age, Gender, Blood Group
* Medical Conditions
* Allergies
* Personal Preferences

## 🤖 AI Symptom Assistant

* Chat-based health guidance
* Personalized responses using profile context
* Structured AI outputs
* Friendly and practical suggestions

## 💊 Medicine Management

* Add medicines
* Dosage tracking
* Active medicine records

## 📄 Medical Reports

* Save reports
* View recent records
* Use report context in AI chat

## 🚨 Smart Safety Layer

* Detect urgent symptoms
* Basic escalation guidance
* Safe fallback responses

## 📱 Modern UX

* Responsive UI
* Fast loading experience
* Clean dashboard layout

---

# 🛠 Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | Next.js App Router          |
| Backend         | Next.js API Routes          |
| Database        | Prisma ORM                  |
| Database Engine | SQLite / PostgreSQL / MySQL |
| Authentication  | JWT + HttpOnly Cookies      |
| AI Integration  | Google Gemini API           |
| Styling         | Tailwind CSS                |
| Icons           | Lucide React                |
| Deployment      | Vercel                      |

---

# 🧱 Architecture Overview

```txt
User
 ↓
Next.js Frontend
 ↓
API Routes
 ├── Auth API
 ├── Profile API
 ├── Medicines API
 ├── Reports API
 └── AI Chat API
        ↓
   Gemini AI Model
        ↓
 Prisma Database
```

---

# 📂 Folder Structure

```txt
health-care/
├── prisma/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── login/
│   │   ├── onboarding/
│   │   └── profile/
│   └── lib/
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd health-care
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Create Environment File

Create `.env` in root folder:

```env
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secure_secret
DATABASE_URL=file:./dev.db
```

## 4️⃣ Setup Database

```bash
npx prisma db push
```

(Optional Database Viewer)

```bash
npx prisma studio
```

## 5️⃣ Run Development Server

```bash
npm run dev
```

## 6️⃣ Open Browser

```txt
http://localhost:3000
```

---

# 🤖 AI Chat Example

## Input

```txt
I have headache and fever
```

## Output

```txt
Likely common causes:
Viral infection, dehydration, stress

What to do now:
Drink fluids, rest, monitor temperature

What to monitor:
Vomiting, severe pain, weakness

When to see doctor:
If symptoms worsen or fever remains high
```

---

# 🔐 Security Features

* JWT Authentication
* Protected API Routes
* Secure Cookie Sessions
* Error Handling
* Input Validation Ready
* Environment Variable Protection

---

# 📈 Future Improvements

* Voice Assistant
* Push Notifications
* Medicine Reminders
* OCR Report Scanner
* Multi-language Support
* PWA / Mobile App
* Doctor Appointment Booking
* Analytics Dashboard

---

# 💼 Resume Value

This project demonstrates:

* Full-Stack Development
* REST API Design
* Database Management
* Authentication Systems
* AI Integration
* Prompt Engineering
* Real-World Product Thinking
* Scalable Architecture Basics

---

# 🎯 Why This Project Stands Out

Unlike basic CRUD projects, VitaCare solves a real problem using modern AI workflows, secure authentication, personalized healthcare context, and production-style architecture.

---

# ![Coder](https://giphy.com) Author

**Vishnu Rudroji**
CSE Student | Full Stack Developer | AI Builder

---

# 📄 License

for my start up && for my job purpose
