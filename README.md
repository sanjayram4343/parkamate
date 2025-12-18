# ParkMate - Smart Parking Management System

A complete full-stack application for managing parking slots with React frontend and Node.js backend.

## Project Structure

```
ParkMate/
├── backend/          # Node.js + Express API
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React Context for state management
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── App.js        # Main App component
│   │   └── App.css       # Application styles
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## Features

### Authentication
- JWT-based authentication
- Protected routes
- Demo credentials: admin@example.com / admin

### Dashboard
- Overview of parking statistics
- Quick action links
- Motivational quotes

### Parking Management
- View all parking slots (101-105)
- Real-time slot status (available/occupied)
- Click to book available slots
- View details of occupied slots

### Booking System
- Book parking slots with vehicle details
- Form validation
- Real-time slot updates

### Records
- View parking history
- Tabular display of all bookings

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
  - See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed setup instructions

### Installation & Setup

1. **Clone/Navigate to the project directory**
   ```bash
   cd parkmate2
   ```

2. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions
   - Make sure MongoDB is running on port 27017 (default)

3. **Configure Backend**
   ```bash
   cd backend
   # Copy and configure environment variables
   # Update MONGODB_URI in .env file if needed
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   ```
   Backend will run on http://localhost:5000

5. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on http://localhost:3000

### Demo Credentials
- **Email:** admin@example.com
- **Password:** admin

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Parking Management
- `GET /api/parking/slots` - Get all parking slots
- `GET /api/parking/slots/:id` - Get specific slot details
- `POST /api/parking/slots/:id/book` - Book a parking slot
- `GET /api/parking/records` - Get parking history

## Technology Stack

### Frontend
- React 18
- React Router DOM v6
- Axios for API calls
- Context API for state management
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- CORS enabled
- Bcrypt for password hashing

## Usage

1. Open http://localhost:3000 in your browser
2. Login with demo credentials
3. Navigate through the dashboard to:
   - View parking slot status
   - Book available slots
   - Check parking records
4. All data persists during the session

## Development

The application is fully functional with:
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Responsive Design
- ✅ Real-time Updates
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States

## Database Features

- **MongoDB Integration**: Persistent data storage
- **User Management**: Secure user authentication with bcrypt
- **Data Models**: Structured schemas for users, parking slots, and records
- **Automatic Initialization**: Creates default data on first run
- **Database Seeding**: Optional script to populate sample data

## Additional Features

- **Release Slot**: Admin can release occupied parking slots
- **Booking History**: Complete tracking of all parking activities
- **User Roles**: Admin and user role management
- **Data Persistence**: All data is stored in MongoDB
- **Auto-calculated Duration**: Parking duration calculated automatically

## Notes

- Data persists in MongoDB database
- CORS is configured for frontend-backend communication
- All routes except /login are protected
- Responsive design works on mobile and desktop
- Default admin credentials: admin@example.com / admin