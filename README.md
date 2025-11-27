###🚗 Car Selling Website — Frontend
A modern car sales platform with full customer buying flow, car browsing, comparison, checkout, contract signing, and payment integration.

⸻

**📌 Overview
**
This is the Frontend of a full-stack Car Selling Web Application.
The system allows customers to browse cars, compare models, create orders, sign contracts, make payments, and track their order progress.

The frontend is built using React + Vite, powered by Ant Design, TailwindCSS, React Router, Axios, and integrated with the backend API for authentication, orders, and contract/payment flows.

⸻

**🏗️ Tech Stack
**
| Category       | Technologies |
|----------------|--------------|
| Framework      | React.js, Vite |
| State Mgmt     | React Context |
| UI Library     | Ant Design, TailwindCSS |
| Routing        | React Router |
| HTTP Client    | Axios |
| Authentication | JWT-based Auth, HTTP Only Cookies |
| Build Tools    | Vite |

⸻

**📚 Features
**
⭐ 1. Authentication Module
	•	Customer Login / Register
	•	Admin Login
	•	JWT Storage & Auto Redirect
	•	Role-based protected routes

⸻

🚘 2. Car Browsing Module
	•	Full car listing with pagination
	•	Advanced Filtering (Brand, Car Type, Fuel, Transmission, Price Range, Seat, Year…)
	•	Car Detail Page
	•	Car Comparison (2 cars side-by-side) with aligned grid layout
	•	Cost Estimate calculator

⸻

🛒 3. Checkout Flow
	•	User selects a car → navigates to Info Filling Page
	•	Customer inputs:
	•	Personal information
	•	Payment method
	•	Deposit amount (must follow business logic 30%+)
	•	Submit to create Order via backend
	•	Redirect to Customer Portal

⸻

👤 4. Customer Portal (Similar to TripleSeat Customer Portal)

After creating an order, customer can access:

a. Customer Info
	•	View (and optionally update) personal profile

b. Order Tracking
	•	View all orders
	•	View order status (pending, confirmed, cancelled)

c. Contract Module
	•	View contract PDF
	•	Sign electronic signature (buyer side)
	•	Status auto-updates

d. Payment Module
	•	Show total price, deposit, remaining amount
	•	Choose payment method (Cash / Bank Transfer / QR)
	•	Sync with backend payment status
	•	Shows payment confirmation

⸻

🔧 5. Admin Portal (Partial Frontend Only)

(Handled by another team member)
	•	Manage Orders
	•	Manage Cars
	•	Admin contract signing
	•	Confirm payments

⸻

**🔗 Backend Connection
**
This frontend communicates with a Node.js/Express backend via Axios.
Backend routes include:
	•	/customers/login
	•	/customers/register
	•	/orders/customers-create
	•	/orders/:id
	•	/orders/:id/paymentmethod
	•	/orders/:id/deposit
	•	/cars
	•	/contracts/*

⸻

**🧪 Key Business Logic Implemented in Frontend
**
  •	Auto-redirect based on user role
	•	Persist user session using localStorage
	•	Deposit validation (>=30% or 100% of total price)
	•	Car comparison grid alignment
	•	Customer portal navigation
	•	Image gallery + thumbnails
	•	Payment method logic sync with backend
	•	Responsive UI for mobile / desktop

⸻

**🚀 Future Improvements
**
  •	Real Stripe integration (redirect checkout)
	•	Live delivery tracking
	•	Car recommendation using ML model
	•	Multi-step checkout UX redesign
	•	Dark mode enhancement

⸻

**👥 Team Members
**
	•	Frontend Dev (Lead) – [Your Name]
	•	Frontend Dev – [Member 2]
	•	Backend Dev – [Member 3]

All Rights Reserved — This project is developed for educational purposes only.
Do not copy, distribute, or reuse without permission from the authors.
