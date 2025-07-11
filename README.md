# 🚘 MyRideLink

A full-stack platform for ride comparison, car rentals, public transport, and more.  
Built with a modern React + Vite frontend and a robust Node.js/Express backend.

---

## 🗂 Project Structure

```
MyRideLink/
├── backend/      # Node.js/Express API, MySQL, Redis, Stripe, etc.
├── frontend/     # React + Vite app (modern UI, routing, etc.)
└── README.md     # This file
```

---

## 🌐 Frontend (React + Vite)

- **Tech:** React 19, Vite, React Router, modern CSS, react-hot-toast, react-icons
- **Features:**
  - Beautiful, responsive home page
  - Navbar with client-side routing
  - Login/Signup page with toggle (single file, modern design)
  - Placeholder pages for Rides, Rentals, Public Transport, Food, Parcel
  - Global and component-based CSS for consistent design
  - Toast notifications for user feedback

### 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173)
- Edit pages in `src/pages/`, components in `src/components/`
- Update global styles in `src/index.css`

---

## 🖥 Backend (Node.js/Express)

- **Tech:** Node.js, Express, MySQL (Sequelize), Redis, Stripe, JWT, Swagger, Nodemailer, Firebase (optional)
- **Features:**
  - RESTful API for authentication, rides, payments, notifications, admin, etc.
  - Real-time features with Socket.IO
  - Secure authentication (JWT)
  - Rate limiting, CORS, Helmet, input validation
  - Email and push notifications
  - API docs at `/api-docs`
  - Health checks at `/health`

### 🚀 Getting Started

```bash
cd backend
npm install
cp env.example .env   # Fill in your environment variables
npm run dev           # or: npm start
```

- API: [http://localhost:3000](http://localhost:3000)
- API Docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ⚙️ Environment Variables

- See `backend/env.example` for all required variables (DB, JWT, Stripe, Email, etc.)
- For development, you can use dummy values for email/Firebase if not needed

---

## 🛣 Routing Overview

- **Frontend:**
  - `/` — Home (public)
  - `/login` — Login/Signup (toggle)
  - `/rides`, `/rentals`, `/public-transport`, `/food`, `/parcel` — Individual pages (public or protected as needed)
- **Backend:**
  - `/api/v1/auth` — Auth endpoints
  - `/api/v1/rides` — Rides API
  - `/api/v1/payments` — Payments API
  - `/api/v1/notifications` — Notifications API
  - `/api/v1/admin` — Admin API
  - `/api-docs` — Swagger docs

---

## 🧪 Testing

- **Backend:**
  - Run `npm test` in `backend/` for Jest tests
- **Frontend:**
  - Add tests as needed (e.g., with React Testing Library)

---

## 📝 Contributing

1. Fork the repo and create a feature branch
2. Commit with clear messages
3. Push and open a Pull Request

---

## 📄 License

MIT (or your preferred license)

---

**Questions?**  
Open an issue or contact the maintainers.
