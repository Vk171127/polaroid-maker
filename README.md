# 📸 Polaroid Maker

A mobile-first web application for ordering custom Polaroid prints.

The application is designed primarily for an **in-person stall experience** where customers scan a QR code, select a Polaroid layout, upload and adjust their photos, preview the final print, and place an order with minimal friction.

## 🚧 Project Status

**In active development.**

The frontend customer flow is currently being built first, followed by the backend and admin workflow.

## ✨ Planned Customer Flow

```text
Home
  ↓
Select Polaroid Layout
  ↓
Upload Photos
  ↓
Crop / Adjust Photos
  ↓
Preview Final Print
  ↓
Enter Name & Phone Number
  ↓
Place Order
  ↓
Order ID + Thank You Message
```

The customer experience is designed as a guided workflow, with the possibility of using a multi-step modal rather than forcing customers through multiple separate pages.

## 🖼️ Layouts

The application currently supports multiple Polaroid layouts with different photo counts and pricing.

| Layout | Photos | Price |
| ------ | ------ | ----- |
| Small  | 4      | ₹50   |
| Medium | 2      | ₹40   |
| Large  | 1      | ₹35   |

The selected layout determines the number of photos required and the corresponding printable format.

## 👤 Customer Experience

Customers do not need to create an account.

The intended customer flow is intentionally lightweight:

- Select a layout
- Upload the required number of photos
- Adjust/crop each photo to fit the Polaroid format
- Review the final printable preview
- Provide name and phone number
- Place the order
- Receive an order ID and confirmation

The application is **mobile-first**, since the primary use case is customers accessing it through their phones at the stall.

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- FastAPI
- Python
- SQLAlchemy
- PostgreSQL

### Planned Infrastructure

- Frontend deployment
- Backend deployment
- CI/CD
- Image storage

## 🏗️ Architecture

The frontend is being structured around reusable components, layouts, and route-based navigation.

Current structure includes concepts such as:

```text
src/
├── components/
├── layouts/
├── pages/
├── routes/
├── data/
└── types/
```

The application uses React Router nested routes and reusable layouts rather than relying on a framework-level layout system.

## 🔐 Admin Workflow

The application will also provide an admin interface for managing print orders.

Planned admin flow:

```text
Admin Login
    ↓
Dashboard
    ↓
Pending Orders
    ↓
Order Details
    ↓
Review Preview
    ↓
Print A6 Sheet
    ↓
Update Order Status
```

Admins will be able to review customer orders, view the uploaded images and final preview, and initiate the printing workflow.

## 📋 Development Roadmap

### Frontend

- [x] Project setup
- [x] Routing and shared layout
- [x] Layout selection foundation
- [x] Layout selection modal foundation
- [ ] Image upload workflow
- [ ] Image cropping
- [ ] Crop navigation
- [ ] Shared order state
- [ ] Customer preview
- [ ] Complete customer ordering flow

### Backend

- [ ] FastAPI project setup
- [ ] Database models
- [ ] Image upload API
- [ ] Order management API
- [ ] Frontend/backend integration
- [ ] Order submission

### Admin

- [ ] Admin authentication
- [ ] Admin dashboard
- [ ] Order details
- [ ] Printing workflow
- [ ] Order status management

### Finalization

- [ ] Splash screen
- [ ] Responsive UI improvements
- [ ] Loading and error states
- [ ] Testing
- [ ] CI/CD
- [ ] Production deployment

## 🎯 Project Goal

The goal is to build a simple, reliable ordering experience for a physical Polaroid-printing stall while keeping the application maintainable enough to support future improvements.

The project is also being used as a practical exercise in building a complete application from frontend interaction through backend APIs, database persistence, image processing, authentication, and deployment.
