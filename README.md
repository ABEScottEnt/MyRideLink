# MyRideLink

A modern ride-sharing platform with a mobile app built using **React Native + Expo** and a backend powered by **Node.js, Express, and Firebase**. Hosted on **Render** for seamless deployment.

---

## 🚀 Features

- Cross-platform mobile app (iOS & Android) with React Native + Expo
- Expo Router for navigation
- User authentication & management
- Ride booking, payment, and notifications
- Real-time updates (Socket.IO)
- Backend API with Node.js, Express, and Firebase
- Secure, rate-limited, and production-ready

---

## 🛠️ Tech Stack

### Frontend

- React Native
- Expo
- Expo Router

### Backend

- Node.js
- Express
- Firebase (Auth, Firestore, etc.)

### Deployment

- Render (for backend and/or static hosting)

---

## 🧑‍💻 Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`) or Expo Go App

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/MyRideLink.git
cd MyRideLink
```

### 2. Setup the Backend

```sh
cd backend
npm install
# Copy and configure your .env file (see backend/ENV_INSTRUCTIONS.txt)
```

- Start the backend:

```sh
npm start
```

### 3. Setup the Mobile App

```sh
cd frontend
npm install
```

- Start the Expo app:

```sh
npx expo start
```

- Scan the QR code with your Expo Go app or run on an emulator.

---

## 🌐 Deployment

### Backend (Node.js/Express)

- Deploy to [Render](https://render.com/) using the Render dashboard or `render.yaml`.
- Set environment variables in the Render dashboard.

### Mobile App

- Build with Expo Application Services (EAS) or publish to Expo Go.
- See [Expo docs](https://docs.expo.dev/) for details.

---

## 📁 Project Structure

```
MyRideLink/
  backend/         # Node.js + Express + Firebase backend
  MyNewApp/        # React Native + Expo frontend (replace with your app folder)
  README.md
```

---

## 📞 Contact

For support or questions, open an issue or contact [info@abescottent.com](mailto:info@abescottent.com).