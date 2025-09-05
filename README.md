# Workcity Chat – Frontend

This is the **frontend** of the Workcity Chat Application, built with **React** and **Vite**.  
It provides an admin dashboard, chat UI, and integration with the backend (Node.js + Express) and Ably for real-time messaging.

---

## Features
- **Authentication** (login/signup via backend API)
- **Admin Dashboard**:
  - Manage users (Admin, Agent, Designer, Merchant)
  - Perform CRUD operations
- **Chat UI**:
  - Conversations between users
  - Send & receive messages in real time (via Ably)
  - Typing indicators
  - Read receipts
- **Role-based Access**:
  - Admin has elevated privileges
  - Agents/Designers/Merchants can chat with users

---

## Technologies
- **React 18** + **Vite**
- **React Router DOM** – client-side routing
- **Axios** – API requests
- **Context API** – global auth/user state
- **Ably Realtime SDK** – real-time pub/sub
- **Tailwind CSS** – styling
- **CORS with credentials** – secure API communication

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/workcity-chat-frontend.git
cd workcity-chat-frontend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
VITE_ABLY_KEY=your-ably-public-key
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend will be available at:
[http://localhost:5173](http://localhost:5173)

---

## Backend Setup (Required)

Make sure the backend is running (Node.js + Express).
Update **CORS settings** in backend (`app.js`):

```js
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
```

---

## Common Issues & Fixes

### CORS Error with Credentials

Error:

```
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'
```

Fix: Backend must **not** use `"*"` for origin.
Set it to `http://localhost:5173` and enable `credentials: true`.

---

### Network Error in Axios

* Ensure `withCredentials: true` is set in Axios.
* Example Axios instance:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;
```

---

## Challenges Faced

1. **CORS with credentials** – Had to configure backend to allow frontend origin instead of `*`.
2. **Ably integration** – Setting up channels and ensuring events publish/subscribe correctly.
3. **Role-based access** – Creating a clean way for Admin vs. normal users to interact with different dashboards.
4. **State management** – Using Context API to sync auth state across routes and components.

---

## Project Structure

```
src/
│── App.jsx
│── main.jsx
│── context/         # Auth and global state
│── pages/           # Login, Chat, AdminDashboard, etc.
│── hooks/           # Custom hooks (e.g., useAbly)
│── ably/            # Ably client setup
│── components/      # Shared components
```

---

## Next Steps

* Improve UI/UX with Tailwind components
* Add **file uploads** in chat
* Better **error handling**
* Deploy frontend (e.g., Netlify, Vercel)

---

## License

MIT License – free to use and modify.

```
