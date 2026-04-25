# CommunityConnect — NGO Field Data Platform

A MERN stack app to replace scattered paper surveys with a centralized real-time platform for NGOs.

## Tech Stack
- **MongoDB** — stores needs, users, volunteers
- **Express.js** — REST API
- **React.js** — frontend dashboard
- **Node.js** — runtime

## Features
- **Admin**: Report community needs, view dashboard stats, smart volunteer matching
- **Volunteer**: Browse needs board, view dashboard
- **Smart matching**: Scores volunteers by area proximity and skill category
- **Filters**: Filter needs by category, urgency, status, area

## Quick Start

### 1. Start MongoDB
```bash
# Make sure MongoDB is running locally
mongod
```

### 2. Backend
```bash
cd backend
cp .env.example .env       # edit if needed
npm install
npm start
```
Server starts at http://localhost:5000
Auto-seeds admin: **admin@ngo.com / Admin@123**

### 3. Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```
App opens at http://localhost:3000

## Default Login
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ngo.com | Admin@123 |
| Volunteer | Sign up at /register | — |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register volunteer |
| GET | /api/needs | List needs (with filters) |
| GET | /api/needs/stats | Dashboard stats |
| POST | /api/needs | Add need (admin) |
| PUT | /api/needs/:id | Update need |
| DELETE | /api/needs/:id | Delete need (admin) |
| GET | /api/needs/match/:id | Smart volunteer match |
| GET | /api/volunteers | List volunteers |
| PUT | /api/volunteers/:id | Update volunteer |
