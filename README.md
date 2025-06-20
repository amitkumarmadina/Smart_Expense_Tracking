# 💸 Smart Expense Tracker

A sleek and simple full-stack expense tracker built using **React + Firebase**, designed to help users manage and visualize their daily spending in real-time.

---

## 🔧 Features

- 🧾 Add, edit, and delete expenses
- 📊 Pie chart summary of spending categories
- 🔐 Firebase Authentication (Email/Password)
- ☁️ Real-time Firestore database
- 📱 Responsive UI with Tailwind CSS
- 📅 Timestamp tracking for each entry

---

## 🛠️ Tech Stack

| Frontend       | Backend           | Database      | Auth        |
|----------------|-------------------|---------------|-------------|
| React (Vite)   | Firebase Functions| Firestore     | Firebase Auth |
| Tailwind CSS   | --                | Realtime Sync | Email Login  |

---

## 🚀 Getting Started

1. **Clone this repository**

```bash
git clone https://github.com/amitkumarmadina/Smart_Expense_Tracking.git
cd Smart_Expense_Tracking
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

Create a Firebase project at https://console.firebase.google.com

Enable Firestore and Authentication

Create .env file and add your keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id

```

4. **Run locally**
```bash
npm run dev
```

## 🌐 Live Demo
Deployed at: https://smart-expense-tracking.vercel.app/

## 📁 Folder Structuer
```bash
src/
│
├── firebase.js          # Firebase config
├── App.jsx              # Main App
├── components/          # Reusable components
│   ├── AddExpense.jsx
│   ├── ExpenseList.jsx
│   └── SummaryChart.jsx
```

## Made With ❤️ by AMIT KUMAR MADINA
LinkedIn: linkedin.com/in/amitkumarmadina
GitHub: @amitkumarmadina
