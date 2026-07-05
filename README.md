# 🧁 Bindi's Cupcakery

<div align="center">

AI-powered, full-stack e-commerce platform for Bindi's Cupcakery

![Google Winter Of Code](https://img.shields.io/badge/Google%20Winter%20Of%20Code-2025-4285F4?logo=google&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.0+-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.0+-000000?logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)

</div>

---

## 🏆 Google Winter Of Code 2025
This high performance full stack e commerce architecture was proudly conceptualized and developed for Google Winter Of Code 2025. The initiative focuses on bridging traditional artisanal commerce with next generation cloud computing and generative artificial intelligence. By integrating Google Gemini 2.5 Flash for automated customer consultation and Google Identity Services for frictionless authentication, Bindi's Cupcakery demonstrates how modern web standards can transform local bakery operations in Surat into scalable enterprise deployments.

---

## ✨ Comprehensive Feature Suite

### 🤖 Live AI Bakery Consultant
The floating chat widget is powered by Google Gemini 2.5 Flash with a custom system prompt covering the full product catalog, Surat local business details, Parle Point delivery windows, and box discount logic. A lightweight local NLP engine provides silent fallback coverage so customers always receive an instant intelligent response even if cloud AI services are temporarily offline.

### 🔐 Google OAuth Authentication
Seamless one click sign in powered by Google Identity Services. Upon authentication, user sessions are securely managed with JSON Web Tokens stored in HTTP only cookies and local storage, ensuring customers remain logged in across browser sessions while automatically syncing their profile information.

### 🛒 Smart Shopping Cart and Customization
An intelligent cart system that treats unique product customizations as distinct line items. Customers can customize flavours, frosting, box sizes, and gift messages. The cart dynamically calculates subtotal discounts from promotional codes like BINDI10 and automatically applies free delivery thresholds for orders above 500 Rupees.

### 💳 Intelligent Checkout and Instant Payments
Zero friction checkout architecture that automatically retrieves and pre populates customer names, email addresses, phone numbers, and delivery locations from their saved profile. Supports modern Indian payment workflows including instant online UPI, Google Pay, and Cash on Delivery with immediate payment recognition and order verification.

### 📬 Luxury Designer Email Receipts
Every confirmed order triggers an automated high end HTML email receipt sent directly to the customer inbox via Nodemailer and Google Workspace SMTP. Receipts feature order reference numbers, verified payment status badges, itemized product tables with smart emoji food recognition, estimated kitchen preparation timers of 30 to 45 minutes, location pins, and direct WhatsApp support links.

### 🔔 Real Time Admin Notifications
Simultaneously with customer receipts, the system fires an instant priority email alert directly to the bakery owner inbox. This alert includes customer contact details, exact order monetary totals, payment methods, and a one click direct link to the kitchen management panel for immediate order processing.

### 👑 Enterprise Admin Management Dashboard
A dedicated protected control panel for bakery management. Administrators can perform live catalog operations including adding new products with instant Cloudinary image uploads, editing prices and descriptions, managing inventory availability, tracking active kitchen orders, inspecting customer directories, and moderating public product reviews.

### 📊 Live Business Analytics and Statistics
Real time financial and operational intelligence integrated directly into the admin dashboard. Computes live total revenue, order volume counts, registered customer growth, and category distribution. Includes interactive progress bars highlighting top selling bakery items by units sold to drive data informed baking schedules.

### 📱 Persistent WhatsApp Kitchen Support
A sleek floating WhatsApp communication button available across every page of the application. Customers can initiate direct chat conversations with the Surat kitchen help desk for custom wedding cake inquiries, urgent delivery modifications, or live order assistance.

---

## 🔒 Enterprise Security and Best Practices

### Role Based Access Control and Authentication
Server side middleware strictly enforces administrator privileges by validating JSON Web Tokens on every protected API route. Customer passwords and sensitive account credentials are securely hashed using bcrypt encryption before database persistence.

### Server Side Price and Order Verification
To eliminate client side price manipulation risks, the backend independently verifies all item prices against database records and recomputes total checkout amounts on the server during order placement. Fake promotional codes or modified discounts submitted from the browser are silently rejected.

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 18 with Vite |
| Language | TypeScript |
| UI Library | Material UI v5 |
| Routing | React Router v6 |
| Authentication | Google OAuth 2.0 via @react-oauth/google |
| HTTP Client | Axios |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB Atlas via Mongoose |
| AI Engine | Google Gemini 2.5 Flash |
| Email | Nodemailer via Gmail SMTP |
| Image Storage | Cloudinary |
| Auth | JSON Web Token and Google ID Token verification |

---

## 📁 Project Structure

```
Bindis Cupcakery
├── frontend
│   └── src
│       ├── components
│       │   ├── AiChatWidget.tsx
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   └── whatsapp-float.tsx
│       ├── context
│       │   └── AuthContext.tsx
│       ├── pages
│       │   ├── Home.tsx
│       │   ├── Products.tsx
│       │   ├── Cart.tsx
│       │   ├── Checkout.tsx
│       │   ├── Login.tsx
│       │   └── Admin.tsx
│       └── services
│           └── api.ts
└── backend
    └── src
        ├── controllers
        │   ├── authController.ts
        │   ├── productController.ts
        │   ├── orderController.ts
        │   └── chatController.ts
        ├── models
        ├── routes
        ├── services
        │   └── emailService.ts
        └── index.ts
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- MongoDB Atlas account
- Google Cloud Console project with OAuth 2.0 credentials
- Google AI Studio API key

### 1. Clone the repository
```bash
git clone https://github.com/OmChauhan2023/Bindis-Cupcakery.git
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create backend .env file:
```env
PORT=5000
JWT_SECRET=your_strong_random_secret_here
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=bindiscupcakery@gmail.com
EMAIL_PASS=your_16_char_google_app_password
ADMIN_EMAIL=your_personal_email@gmail.com
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create frontend .env file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run both servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🌱 Available Scripts

### Backend
```bash
npm run dev
npm run build
npm start
npm run seed
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

Made with ❤️ for Bindi's Cupcakery, Surat, Gujarat

© 2026 Bindi's Cupcakery. Made in Surat with artisanal love and care.
