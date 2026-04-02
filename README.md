# 🚗 Car Selling Website — Frontend

A modern car sales platform with a complete customer buying flow: browsing cars, comparison, checkout, contract signing, payment, and customer portal.

---

## 📌 Overview

This is the **Frontend** of a full-stack Car Selling Web Application.  
Customers can browse cars, compare models, create orders, sign contracts, make payments, and track order progress.

The frontend is built using **React + Vite**, with Ant Design, TailwindCSS, React Router, and Axios—all fully integrated with backend authentication, order processing, contract signing, and payment logic.

---

## 🏗️ Tech Stack

| Category       | Technologies |
|----------------|--------------|
| Framework      | React.js, Vite |
| State Mgmt     | React Context |
| UI Library     | Ant Design, TailwindCSS |
| Routing        | React Router |
| HTTP Client    | Axios |
| Authentication | JWT-based Auth, HTTP Only Cookies |
| Build Tools    | Vite |

---

## 📚 Features

### ⭐ 1. Authentication Module
- Customer Login / Register  
- Admin Login  
- JWT Storage & Auto Redirect  
- Role-based Protected Routes  

---

### 🚘 2. Car Browsing Module
- Full car listing with pagination  
- Advanced filtering (Brand, Type, Fuel, Transmission, Price Range, Seat, Year…)  
- Car Detail Page  
- Car Comparison (2 cars side-by-side, aligned grid layout)  
- Cost Estimate Calculator  

---

### 🛒 3. Checkout Flow
- User selects a car → navigates to **Info Filling Page**  
- Customer enters:
  - Personal information  
  - Payment method  
  - Deposit amount (must follow ≥30% business rule)  
- Submit to backend to create an Order  
- Redirect to **Customer Portal**

---

## 👤 4. Customer Portal

### a. Customer Info  
- View personal profile  
- Update profile  

### b. Order Tracking  
- View all orders  
- Check progress (pending / confirmed / cancelled)

### c. Contract Module  
- View contract PDF  
- Sign electronic signature (buyer)  
- Contract status auto-updates  

### d. Payment Module  
- Show total price, deposit, remaining amount  
- Choose payment method (Cash / Bank Transfer / QR)  
- Sync payment status with backend  
- Shows success status  

---

## 🔧 5. Admin Portal (Partial Frontend)
*(Handled by another teammate)*  
- Manage Orders  
- Manage Cars  
- Admin contract signing  
- Payment confirmation  

---

## 🔗 Backend Connection

Frontend communicates with a Node.js/Express backend via Axios.  
Main API endpoints used include:

- `/customers/login`  
- `/customers/register`  
- `/orders/customers-create`  
- `/orders/:id`  
- `/orders/:id/paymentmethod`  
- `/orders/:id/deposit`  
- `/cars`  
- `/contracts/*`  

---

## 🧪 Key Business Logic Implemented in Frontend

- Role-based auto redirect  
- Session persistence via localStorage  
- Deposit validation (≥30% or 100% full payment)  
- Car comparison grid alignment  
- Customer Portal navigation  
- Payment + contract flow matching backend’s rules  
- Responsive UI/UX  

---

## 🚀 Future Improvements

- Real Stripe integration  
- Delivery tracking  
- Car recommendation using ML  
- Multi-step checkout redesign  
- Improved dark mode  

---

## 👥 Team Members

- **Frontend Developer (Lead)** – Doan Thi Dieu Hang 
- **Frontend Developer** – Nguyen Huu Anh Duc
- **Backend Developer** – Vuong Quy Thanh 

---

### © All Rights Reserved  
This project is developed for **educational purposes only**.  
Do not copy, distribute, or reuse without permission.
