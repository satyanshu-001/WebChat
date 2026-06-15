# WebChat 💬

A real-time chat application built with the MERN stack that enables users to connect, authenticate, and exchange messages through a modern and responsive interface.

## Features

* User Authentication (Signup/Login)
* Secure JWT-based Authentication
* Real-time Messaging
* Responsive UI
* User Profile Management
* Modern React Frontend
* RESTful Backend API
* MongoDB Database Integration

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

## Project Structure

```text
chatify/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   └── package.json
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/satyanshu-001/WebChat.git
cd WebChat
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Future Improvements

* Group Chats
* Typing Indicators
* Message Read Receipts
* Media/File Sharing
* Online User Status
* Notifications



GitHub: https://github.com/satyanshu-001
