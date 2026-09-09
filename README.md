# Mahmoud Siam — 3D Interactive Portfolio & Client Request Management System

A fully immersive 3D personal portfolio with an integrated client project request management system.

## Tech Stack

### Frontend
- React 18 + Vite
- Three.js + React Three Fiber + Drei
- GSAP + Framer Motion
- Tailwind CSS
- React Router v6
- Recharts

### Backend
- Node.js + Express.js
- MySQL (via mysql2)
- bcrypt (password hashing)
- express-session (admin auth)
- multer (file uploads)
- Nodemailer (email notifications)
- Helmet + CORS + Rate Limiting

## Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **MySQL** 8.x running locally

### 1. Clone & Install

```bash
# Install all dependencies (root + client + server)
npm run install:all
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_requests
DB_USER=root
DB_PASSWORD=your_mysql_password
SESSION_SECRET=generate-a-random-string-here
```

### 3. Create MySQL Database

```sql
CREATE DATABASE portfolio_requests CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Migrations

```bash
npm run migrate
```

This creates all required tables: admins, clients, project_requests, request_attachments, request_notes, audit_logs, admin_settings.

### 5. Create Admin Account

```bash
npm run create-admin
```

You will be prompted to enter an admin email and password.

### 6. Start Development

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or start separately:

```bash
npm run dev:client    # Vite dev server on port 5173
npm run dev:server    # Express API on port 5000
```

### 7. Access the Application

| Page | URL |
|------|-----|
| 3D Portfolio | http://localhost:5173 |
| Request a Project | http://localhost:5173/request-project |
| Track Request | http://localhost:5173/track-request |
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin |

## Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

The Express server will serve the built client from `client/dist/`.

## Project Structure

```
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # 3D & UI components
│   │   ├── context/           # Language, Theme, Auth contexts
│   │   ├── data/              # Portfolio data
│   │   ├── hooks/             # Custom hooks
│   │   ├── locales/           # EN/AR translations
│   │   ├── pages/             # Request form, tracking, admin pages
│   │   ├── scenes/            # 3D scenes
│   │   ├── sections/          # Portfolio sections
│   │   ├── services/          # API service layer
│   │   └── shaders/           # GLSL shaders
│   └── ...
│
├── server/                    # Express Backend
│   ├── config/                # Database config
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth & upload middleware
│   ├── migrations/            # SQL migration files
│   ├── routes/                # API routes
│   ├── scripts/               # CLI utilities (migrate, create-admin)
│   └── services/              # Email & audit services
│
├── uploads/                   # Uploaded project files
├── .env.example               # Environment variable template
└── package.json               # Root monorepo scripts
```

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Submit project request |
| GET | `/api/requests/track/:ref` | Track request status |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/health` | Health check |

### Admin (Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | Current admin info |
| GET | `/api/requests` | List all requests |
| GET | `/api/requests/:id` | Request details |
| PUT | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |
| PUT | `/api/requests/:id/status` | Change status |
| PUT | `/api/requests/:id/priority` | Change priority |
| POST | `/api/requests/:id/notes` | Add private note |
| GET | `/api/requests/:id/notes` | Get notes |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/charts` | Chart data |
| GET | `/api/dashboard/clients` | Client list |
| GET | `/api/dashboard/notifications` | Unread notifications |

## Features

### 3D Portfolio
- Immersive WebGL 3D experience
- Arabic (RTL) & English (LTR) support
- Dark & Light themes
- 9 portfolio sections with 3D scenes
- Responsive across all devices

### Client Request System
- Multi-step 3D project request form
- File upload with security validation
- Email notifications (admin + client confirmation)
- Request tracking with reference number

### Admin Dashboard
- Secure login with session-based auth
- Dashboard with statistics & charts
- Full request management (CRUD)
- Private admin notes
- Client management
- Search, filter, sort, pagination
- Notification system
- Audit logging
- Bilingual admin interface (AR/EN)
- Mobile responsive

## Email Configuration (Optional)

To enable email notifications, configure SMTP in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

## Security

- bcrypt password hashing (12 rounds)
- HTTP-only secure session cookies
- Helmet security headers
- CORS with origin whitelist
- Rate limiting on public endpoints
- Input validation & sanitization
- Parameterized SQL queries (no injection)
- File upload: MIME + extension validation, blocked executables
- No credentials in source code

## License

MIT © Mahmoud Siam
