# 🪷 BINDIS — Sweet Shop & Bakery Web App

A modern, full-stack web application for **Bindis** — a sweet shop and bakery platform built with **Next.js 15**, **TypeScript**, **Firebase**, and **Tailwind CSS**. Designed to deliver a seamless and delightful shopping experience for traditional Indian sweets and baked goods.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **UI Components** | Radix UI, shadcn/ui, Lucide React |
| **Auth & Storage** | Firebase |
| **Database** | MongoDB (via Mongoose) |
| **Package Manager** | npm |

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse a rich collection of sweets and bakery items
- 🔥 **Firebase Integration** — Real-time data and authentication support
- 🗄️ **MongoDB Backend** — Scalable data storage with Mongoose ODM
- 🎨 **Smooth Animations** — Powered by Framer Motion for a polished UI
- 📱 **Fully Responsive** — Mobile-first design using Tailwind CSS
- ⚡ **Turbopack** — Blazing-fast development builds with Next.js 15

---

## 📁 Project Structure
```
BINDIS/
├── public/          # Static assets (images, icons, fonts)
├── src/             # Application source code
│   ├── app/         # Next.js App Router pages & layouts
│   ├── components/  # Reusable UI components
│   └── lib/         # Utility functions, DB config, Firebase setup
├── components.json  # shadcn/ui configuration
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Firebase** project (for auth/storage)
- A **MongoDB** connection URI

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Anand-Tiwari2404/BINDIS.git
cd BINDIS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Firebase and MongoDB credentials in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📜 Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, create a feature branch, and open a pull request.

1. Fork the project
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m 'Add some amazing feature'`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a Pull Request

> *Made with ❤️ and a sweet tooth 🍬*
