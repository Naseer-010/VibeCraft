# 🏥 HealthSecure - Blockchain-Enabled Medical Records Platform

A secure, decentralized healthcare records management system built with **Next.js** frontend, **Django REST API** backend, and **Quai Network** smart contracts for tamper-proof medical record storage.

![HealthSecure Platform](https://img.shields.io/badge/Platform-Health%20Tech-26A69A?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)
![Django](https://img.shields.io/badge/Backend-Django%205-092E20?style=for-the-badge&logo=django)
![Quai](https://img.shields.io/badge/Blockchain-Quai%20Network-6366F1?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#1-frontend-setup)
  - [Backend Setup](#2-backend-setup)
  - [Smart Contracts Setup](#3-smart-contracts-optional)
- [Deployment](#-deployment)
  - [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
  - [Deploy Backend](#deploy-backend)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## 🎯 Overview

**HealthSecure** addresses critical challenges in medical data management:

| Challenge | Solution |
|-----------|----------|
| **Data Ownership** | Patients control who views their records via visibility toggles |
| **Immutability** | Records hashed on Quai Network blockchain for verification |
| **Interoperability** | Doctors search patients by unique Health ID |
| **Security** | SHA256-based blockchain IDs + JWT authentication |

### How It Works

1. **Patients** register → receive unique Health ID (e.g., `HID-E364-FA82`)
2. **Doctors** register with medical license → search patients by Health ID
3. **Records** created by doctors → stored on-chain via smart contracts
4. **Verification** achieved through blockchain hashing + IPFS

---

## ✨ Features

### For Patients
- 🆔 Unique Health ID generation
- 📊 Personal dashboard with medical history
- 👁️ Control record visibility (hide/show from doctors)
- 🔐 Blockchain-based identity verification

### For Doctors
- 🔍 Search patients by Health ID
- 📝 Create medical records (prescriptions, diagnoses, lab reports)
- 📤 Upload certificates to IPFS
- ✅ Verified doctor badge system

### Technical
- 🔗 **Quai Network** smart contracts for immutable records
- 🌐 **IPFS Integration** via Pinata for document storage
- 🔑 **JWT Authentication** with role-based access
- 🚀 **Vercel-ready** deployment structure

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Backend** | Django 5.x, Django REST Framework |
| **Authentication** | JWT (Simple JWT) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Blockchain** | Quai Network (Orchard Testnet) |
| **Storage** | IPFS via Pinata |

---

## 📁 Project Structure

```
healthsecure/
├── frontend/                 # Next.js application (deploy to Vercel)
│   ├── app/                  # Next.js app router pages
│   │   ├── dashboard/        # Patient & Doctor dashboards
│   │   ├── login/            # Authentication
│   │   └── signup/           # Registration
│   ├── components/           # React components
│   │   ├── dashboard/        # Dashboard-specific
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities & API client
│   │   └── api.ts            # Backend API functions
│   ├── hooks/                # Custom React hooks
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   └── vercel.json           # Vercel configuration
│
├── backend/                  # Django REST API (deploy separately)
│   ├── healthsecure/         # Django project config
│   │   └── settings.py       # Main settings
│   ├── users/                # User management
│   │   ├── models.py         # User, Patient, Doctor models
│   │   ├── views.py          # API endpoints
│   │   └── ipfs_service.py   # Pinata/IPFS integration
│   ├── records/              # Medical records app
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Django CLI
│
├── contracts/                # Quai Network smart contracts
│   ├── contracts/            # Solidity files
│   │   └── MedicalRecordRegistry.sol
│   ├── scripts/              # Deployment scripts
│   ├── hardhat.config.js     # Hardhat configuration
│   └── package.json          # Node dependencies
│
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | v20+ | Frontend & Contracts |
| **Python** | 3.10+ | Backend |
| **npm** | 8+ | Package management |

---

### 1. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

**Frontend runs at:** http://localhost:3000

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cat > .env << EOF
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
EOF

# Run database migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver 0.0.0.0:8000
```

**Backend API runs at:** http://localhost:8000/api

---

### 3. Smart Contracts (Optional)

```bash
# Navigate to contracts
cd contracts

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your private key and RPC URL

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Quai Orchard Testnet
npx hardhat run scripts/deployQuai.js --network quaiOrchard
```

**Contract Addresses:** Saved to `contracts/deployments.json`

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set **Root Directory** to `frontend`

2. **Configure Environment Variables**
   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com/api` |

3. **Deploy** - Vercel auto-detects Next.js and builds

---

### Deploy Backend

Choose your platform:

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

#### Option B: Render
1. Create new **Web Service** on [render.com](https://render.com)
2. Connect repository, set **Root Directory** to `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn healthsecure.wsgi:application`

#### Option C: DigitalOcean App Platform
1. Create new **App** on [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Select repository, set source to `backend/`
3. Configure environment variables
4. Deploy

**Important:** Update Django settings for production:
```python
# backend/healthsecure/settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-backend-url.com']
CORS_ALLOWED_ORIGINS = ['https://your-frontend-url.vercel.app']
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yoursite.com/api` |

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | ✅ |
| `DEBUG` | Debug mode | Default: False |
| `ALLOWED_HOSTS` | Comma-separated hosts | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `PINATA_API_KEY` | Pinata API key | For IPFS |
| `PINATA_SECRET_KEY` | Pinata secret | For IPFS |

### Contracts (`contracts/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PRIVATE_KEY` | Wallet private key | ✅ |
| `QUAI_RPC_URL` | Quai Network RPC | ✅ |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login/` | Login, returns JWT tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh access token |
| `POST` | `/api/auth/register/patient/` | Register patient |
| `POST` | `/api/auth/register/doctor/` | Register doctor |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/profile/` | Get current user profile |
| `PUT` | `/api/auth/profile/` | Update profile |
| `GET` | `/api/auth/stats/` | Dashboard statistics |

### Medical Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/records/` | List user's records |
| `POST` | `/api/records/` | Create record (doctors) |
| `GET` | `/api/records/{id}/` | Get record details |
| `PATCH` | `/api/records/{id}/visibility/` | Toggle visibility |

### Access Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/access/` | List access requests |
| `POST` | `/api/auth/access/` | Create access request |
| `POST` | `/api/auth/access/{id}/revoke/` | Revoke access |

### Patient Search (Doctors Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/patients/{health_id}/` | Search by Health ID |
| `GET` | `/api/patients/{health_id}/records/` | Get patient records |

---

## 🔑 User Roles

| Role | Capabilities |
|------|-------------|
| **Patient** | View own records, toggle visibility, receive Health ID |
| **Doctor** | Search patients, create records, upload to IPFS |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Contract tests
cd contracts
npx hardhat test

# Frontend (if configured)
cd frontend
npm test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for better healthcare data management
</p>
