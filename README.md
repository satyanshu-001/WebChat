# Chuglify

Real-time chat application with authentication, profile management, image sharing, and email onboarding.

Live app: https://chuglify.onrender.com/

## Features

- User signup, login, logout with JWT cookie authentication
- Protected API routes with middleware-based auth checks
- Real-time messaging with Socket.IO
- Text and image message support (Cloudinary uploads)
- Chat partner history and contacts list
- Welcome email flow for new signups (Resend)
- Rate limiting and bot protection with Arcjet

## Tech Stack

### Frontend

- React 19 + Vite
- Zustand for state management
- Axios for API calls
- Tailwind CSS + DaisyUI
- Socket.IO client

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT + cookie-parser
- Socket.IO
- Cloudinary
- Resend
- Arcjet

## Project Structure

```text
Chuglify/
|- backend/
|  |- src/
|  |  |- controllers/
|  |  |- routes/
|  |  |- middleware/
|  |  |- models/
|  |  |- lib/
|  |  |- emails/
|  |  '- server.js
|  '- package.json
|- frontend/
|  |- src/
|  |  |- component/
|  |  |- pages/
|  |  |- store/
|  |  |- hooks/
|  |  '- lib/
|  '- package.json
'- package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB database URI

## Environment Variables

Create [backend/.env](backend/.env) with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=you@yourdomain.com
EMAIL_FROM_NAME=Chuglify

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

## Local Development

Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Run backend:

```bash
npm run dev --prefix backend
```

Run frontend (new terminal):

```bash
npm run dev --prefix frontend
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Production Build

From project root:

```bash
npm run build
npm run start
```

Root scripts do the following:

- `build`: installs backend/frontend deps and builds frontend
- `start`: starts backend server from [backend/src/server.js](backend/src/server.js)

## API Overview

Base URL: `/api`

Auth routes:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `PUT /auth/update-profile` (protected)
- `GET /auth/check` (protected)

Message routes (protected):

- `GET /messages/contacts`
- `GET /messages/chats`
- `GET /messages/:id`
- `POST /messages/send/:id`

## Notes

- In development, frontend uses `http://localhost:3000/api` as API base URL.
- In production, backend serves frontend static build from `frontend/dist`.

## License

ISC
