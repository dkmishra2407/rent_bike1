# 🛵 Moto-Host – Peer-to-Peer Bike Rental Marketplace

A full-stack bike rental platform where users can book bikes listed by hosts, complete with secure payments, document verification, and real-time communication.

---

## 🚀 Features

- 🔐 **Role-Based Authentication** using JWT (Admin, Host, User)
- 📸 **Cloudinary Integration** for host document & bike uploads
- ✅ **Admin Verification** for listed bikes
- 💬 **Real-Time Chat** between host and user (Socket.IO)
- 💳 **Razorpay Payment Gateway** integration
- 📍 **Geoapify Location Autofill** for intuitive booking
- 🌐 **Responsive UI** built with Tailwind CSS

---

## 🧱 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **Payments:** Razorpay
- **Maps & Location:** Geoapify
- **Chat:** Socket.IO
- **File Uploads:** Cloudinary

---

## 🛠️ Setup Instructions

### 🔧 Prerequisites

- Node.js and npm installed
- MongoDB Atlas or local MongoDB instance
- Razorpay API keys
- Cloudinary credentials
- Geoapify API key

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/yourusername/2wheleeee.git
cd 2wheleeee
````

---

### 🔒 2. Setup Backend

```bash
cd backend
npm install
```

#### ✨ Create a `.env` file inside `backend/`

```
FRONTEND_URL=http://localhost:3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

TRANSPORTER_EMAIL=your_email@example.com
TRANSPORTER_PASS=your_email_password
```

```bash
npm run dev
```

---

### 🌐 3. Setup Frontend

```bash
cd ../frontend
npm install
```

#### ✨ Create a `.env` file inside `frontend/`

```
REACT_APP_GEOAPIFY_API_KEY=your_geoapify_api_key
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm start
```

---

✅ You’re all set! Visit `http://localhost:3000` to explore Moto-Host 🎉
