# 🅿️ Parking Slot Booking App

A full-stack TypeScript application for managing a shared company parking space. Built with **Atomic Design** principles, modern React, and Express.js.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Atomic Design Structure**: Components organized as Atoms, Molecules, and Organisms
- **TypeScript**: Full type safety throughout the application
- **Material UI**: Modern utility-first styling with custom animations
- **Custom Hooks**: State management with `useBookings` hook
- **API Integration**: RESTful communication with backend

### Backend (Node.js + Express)
- **Express.js**: RESTful API server
- **SQLite**: Lightweight database for bookings
- **TypeScript**: End-to-end type safety
- **CORS**: Configured for development and production
- **Error Handling**: Comprehensive error responses

## 📁 Project Structure

```
parking-app/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── atoms/               # Basic building blocks
│   │   │   ├── Button/
│   │   │   └── Input/
│   │   ├── molecules/           # Component combinations
│   │   │   └── FormField/
│   │   └── organisms/           # Complex components
│   │       ├── BookingCard/
│   │       ├── BookingForm/
│   │       └── BookingList/
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API communication
│   ├── types/                   # TypeScript definitions
│   └── App.tsx                  # Main application
├── server/                      # Backend source
│   └── src/
│       ├── models/              # Database models
│       ├── routes/              # API endpoints
│       └── server.ts            # Express server
└── plan.md                      # Development roadmap
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.6.1 or later)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parking-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

### Development

**Option 1 (preffered option): Run both frontend and backend simultaneously**
```bash
yarn dev
```

**Option 2: Run individually**
```bash
# Terminal 1 - Frontend (React dev server on port 3000)
yarn start

# Terminal 2 - Backend (Express server on port 5001)
yarn server:dev
```

### Production Build

```bash
# Build both frontend and backend
yarn build:all

# Start production server
yarn server:start
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:date` | Get booking for specific date |
| POST | `/api/bookings` | Create new booking |
| DELETE | `/api/bookings/:id` | Cancel booking |

### Example API Usage

```javascript
// Create a booking
POST /api/bookings
{
  "employeeName": "John Doe",
  "date": "2025-09-05"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "employeeName": "John Doe",
    "date": "2025-09-05",
    "createdAt": "2025-09-03T08:00:00Z"
  }
}
```

## 🎨 Features

### Core Functionality
- ✅ **Single Slot Booking**: Only one parking slot per date
- ✅ **Date Validation**: Prevents booking past dates
- ✅ **Employee Management**: Track who booked each slot
- ✅ **Booking Cancellation**: Cancel your own bookings
- ✅ **Real-time Updates**: Automatic state management

### User Experience
- 🎭 **Smooth Animations**: Custom CSS animations for interactions
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔔 **Notifications**: Success and error feedback
- ⚡ **Loading States**: Visual feedback during API calls
- 🚨 **Error Handling**: Graceful error recovery

### Technical Features
- 🏗️ **Atomic Design**: Scalable component architecture
- 🔒 **Type Safety**: Full TypeScript coverage
- 🧪 **Linting**: with type-aware rules
- 🗄️ **Database**: SQLite with automatic initialization
- 🔄 **CORS**: Configured for cross-origin requests

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start React development server |
| `yarn build` | Build production frontend |
| `yarn test` | Run tests |
| `yarn lint` | Run lint on source code |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn server` | Start backend server |
| `yarn server:dev` | Start backend with auto-reload |
| `yarn server:build` | Build backend for production |
| `yarn dev` | Run both frontend and backend |
| `yarn build:all` | Build both frontend and backend |

## 🗃️ Database Schema

```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  employeeName TEXT NOT NULL,
  date TEXT NOT NULL UNIQUE,
  createdAt TEXT NOT NULL
);
```

## 🎯 Business Rules

1. **One Slot Per Date**: Only one employee can book the parking slot per day
2. **No Past Bookings**: Cannot book dates in the past
3. **Own Bookings Only**: Can only cancel your own bookings
4. **Required Information**: Employee name and date are required
5. **Unique Dates**: Date constraint prevents double booking

## 🔧 Configuration

### Environment Variables

```bash
# Backend configuration
PORT=5001
NODE_ENV=development
```

### CORS Settings
- **Development**: Allows `http://localhost:3000`
- **Production**: Same-origin only

## 📦 Dependencies

### Frontend
- React 19 + TypeScript
- Tailwind CSS v4
- Custom CSS animations

### Backend
- Express.js v5
- SQLite3
- UUID for ID generation
- CORS middleware

### Development
- es-lint (type-aware linting)
- nodemon (auto-reload)
- ts-node (TypeScript execution)
- concurrently (parallel scripts)

## 🏆 Achievements

✅ **Full-Stack TypeScript** - End-to-end type safety  
✅ **Atomic Design** - Scalable component architecture  
✅ **Modern Tooling** - Latest versions of React, Express, TypeScript  
✅ **Database Integration** - SQLite with proper schema design  
✅ **API Design** - RESTful endpoints with proper error handling  
✅ **User Experience** - Smooth animations and responsive design  
✅ **Production Ready** - Build process and deployment configuration  

---

Built with ❤️ using Atomic Design principles and modern web technologies.
