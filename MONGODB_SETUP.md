# MongoDB Setup Guide for ParkMate

## Option 1: Local MongoDB Installation

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Service (recommended)
5. Install MongoDB Compass (GUI tool) - optional but recommended

### Start MongoDB Service:
```bash
# If installed as service, it should start automatically
# To start manually:
net start MongoDB

# To stop:
net stop MongoDB
```

### Verify Installation:
```bash
# Open Command Prompt and run:
mongosh
# This should connect to MongoDB shell
```

## Option 2: MongoDB Atlas (Cloud Database)

### Setup MongoDB Atlas:
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address
6. Get the connection string

### Update .env file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parkmate?retryWrites=true&w=majority
```

## Option 3: Docker MongoDB

### Using Docker:
```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# To stop
docker stop mongodb

# To start again
docker start mongodb
```

## Setup Instructions for ParkMate

### 1. Install Dependencies:
```bash
cd backend
npm install
```

### 2. Configure Environment:
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/parkmate
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
```

### 3. Seed Database (Optional):
```bash
npm run seed
```

### 4. Start Backend Server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

### 5. Start Frontend:
```bash
cd ../frontend
npm start
```

## Database Collections

The application will create these collections automatically:
- `users` - User accounts and authentication
- `parkingslots` - Parking slot information
- `parkingrecords` - Booking history and records

## Default Data

When you first run the application, it will create:
- Admin user: admin@example.com / admin
- 5 parking slots (101-105)
- Sample parking records

## Troubleshooting

### Connection Issues:
1. Make sure MongoDB service is running
2. Check if port 27017 is available
3. Verify MONGODB_URI in .env file
4. Check firewall settings

### Common Errors:
- `MongoNetworkError`: MongoDB service not running
- `Authentication failed`: Check username/password for Atlas
- `Connection timeout`: Check network/firewall settings

## MongoDB Compass (GUI)

If you installed MongoDB Compass:
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse the `parkmate` database
4. View collections and documents

This provides a visual interface to manage your data.