# 🚦 Traffic Penalty Management System (TPMS)

The **Traffic Penalty Management System (TPMS)** is a full-stack web and mobile application designed to modernize and streamline the process of issuing, managing, and paying traffic penalties. It simplifies the workflow for traffic police, managers, and drivers, offering real-time communication and digital payment options.

## 🔧 Tech Stack

### Web App
- **Backend:** Laravel
- **Frontend:** React (JSX) + Tailwind CSS
- **Database:** MySQL
- **Real-time:** Laravel WebSockets
- **Payment Integration:** Chapa

### Mobile App
- **Framework:** Flutter
- **Backend Communication:** REST API (Laravel)

## 👥 User Roles

### 🛡️ Admin
- Create and manage manager accounts
- Approve or deny activation requests
- View overall system metrics

### 🧑‍💼 Manager
- Log in using email credentials sent by admin
- Update profile and password
- Request account activation from admin
- Manage penalties and officer activity

### 🚗 Driver
- View active penalties
- Pay penalties via Chapa
- View penalty history in card or table format

## ✨ Features

- 🔐 Secure login and role-based access
- 🔄 Real-time updates using Laravel WebSockets
- 📱 Mobile app for drivers
- 🧾 Digital penalty tracking and payments
- 📊 Toggle between card and table views (drivers)
- 💳 Chapa payment integration
- 📦 Modular frontend with separate apps for admin and manager
- 🌑 Elegant dark mode (Projects section)
- 🌀 Animated UI with Framer Motion

## 📁 Project Structure

