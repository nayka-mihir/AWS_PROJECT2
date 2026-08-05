# 🛒 Two-Tier E-Commerce Web Application

A full-stack, containerized **Two-Tier E-Commerce Web Application** built with a **React (Vite)** frontend, an **Express (Node.js)** backend API, and a lightweight file-persisted JSON database. Fully ready for local development, Docker containerization, Docker Hub distribution, and deployment to **AWS EC2**.

---

## 📐 Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                    │
│                                                         │
│   ┌──────────────────┐          ┌───────────────────┐   │
│   │ React Frontend   │  /api    │  Express Backend  │   │
│   │  (Port 3000)     │ ───────► │   (Port 5000)     │   │
│   └──────────────────┘          └─────────┬─────────┘   │
│                                           │             │
│                                    Local Volume         │
│                                           ▼             │
│                                   ┌───────────────┐     │
│                                   │ data/db.json  │     │
│                                   └───────────────┘     │
└─────────────────────────────────────────────────────────┘
```

- **Frontend Tier:** Built with React 18 & Vite, utilizing Lucide React icons and modern responsive CSS.
- **Backend Tier:** Express REST API managing product catalogs, customer orders, and health checks.
- **Database Storage:** Local JSON file store with auto-initialization and volume persistence.

---

## 📂 Repository Structure

```text
.
├── backend/                  # Node.js + Express API server
│   ├── data/                 # Auto-generated JSON database (db.json)
│   ├── src/
│   │   ├── routes/           # Products and Orders API routes
│   │   ├── db.js             # Database handler logic
│   │   └── server.js         # Express server entry point
│   └── Dockerfile            # Standalone Backend Dockerfile
├── frontend/                 # React + Vite application
│   ├── src/                  # React components & API service client
│   └── Dockerfile            # Standalone Frontend Dockerfile
├── docker-compose.yml        # Multi-container Compose configuration
├── Dockerfile                # Multi-stage Dockerfile (Single-port build)
├── AWS_DOCKER_DEPLOYMENT_GUIDE.md # Detailed AWS Deployment Manual
└── package.json              # Monorepo management scripts
```

---

## 🛠️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/AWS_PROJECT2.git
cd AWS_PROJECT2
```

### 2. Install Dependencies
Install dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```

### 3. Run Development Server
Start both Frontend (`http://localhost:3000`) and Backend (`http://localhost:5000`) concurrently:
```bash
npm run dev
```

---

## 🐳 Docker Deployment Options

### Option A: Multi-Container Setup (Docker Compose)

Build and start both services independently:
```bash
docker compose up --build -d
```
- **Frontend App:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **Logs:** `docker compose logs -f`
- **Stop:** `docker compose down`

---

### Option B: Single-Container / Single-Port Setup (Production Multi-Stage)

Build both frontend static assets and backend into a **single Docker image** running on port `5000`:

```bash
# 1. Build the unified Docker image
docker build -t ecom-app:latest .

# 2. Run the single container
docker run -d -p 5000:5000 --name ecom_app ecom-app:latest
```
Access the website at: `http://localhost:5000`

---

## 📦 Docker Hub Publishing Guide

To push your built container images to **Docker Hub**:

### 1. Separate Repositories (Recommended)

```bash
# Log into Docker Hub
docker login

# Build & Tag Images
docker build -t YOUR_DOCKERHUB_USERNAME/ecom-backend:latest ./backend
docker build -t YOUR_DOCKERHUB_USERNAME/ecom-frontend:latest ./frontend

# Push Images to Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/ecom-backend:latest
docker push YOUR_DOCKERHUB_USERNAME/ecom-frontend:latest
```

### 2. Single Unified Repository
```bash
docker build -t YOUR_DOCKERHUB_USERNAME/two-tier-ecom-app:latest .
docker push YOUR_DOCKERHUB_USERNAME/two-tier-ecom-app:latest
```

---

## ☁️ Step-by-Step AWS EC2 Deployment Guide

### Phase 1: Launch AWS EC2 Instance
1. Log in to **AWS Management Console** and navigate to **EC2**.
2. Click **Launch Instance**:
   - **Name:** `ecom-app-server`
   - **AMI:** `Ubuntu 22.04 LTS` (Free Tier Eligible)
   - **Instance Type:** `t2.micro`
   - **Key Pair:** Select or create a new key pair (`my-key.pem`).
3. **Configure Security Group (Inbound Rules):**
   | Type | Protocol | Port Range | Source | Purpose |
   |---|---|---|---|---|
   | SSH | TCP | `22` | My IP / Anywhere (`0.0.0.0/0`) | Remote Terminal Access |
   | Custom TCP | TCP | `3000` | Anywhere (`0.0.0.0/0`) | Frontend Web App |
   | Custom TCP | TCP | `5000` | Anywhere (`0.0.0.0/0`) | Backend API |

---

### Phase 2: Connect & Install Docker on EC2

1. Open your local terminal and connect via SSH:
   ```bash
   chmod 400 my-key.pem
   ssh -i my-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

2. Update system packages and install Docker:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose-v2
   ```

3. Enable non-root Docker usage:
   ```bash
   sudo usermod -aG docker ubuntu
   exit
   ```
   *Reconnect SSH for group permission updates to take effect.*

---

### Phase 3: Deploy Application on EC2

#### **Method 1: Deploy using Git & Docker Compose**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/AWS_PROJECT2.git app
cd app

# Build and run containers in detached mode
docker compose up --build -d
```

#### **Method 2: Deploy using Docker Hub Image**
```bash
# Pull and run directly from Docker Hub
docker run -d -p 5000:5000 --name ecom_app YOUR_DOCKERHUB_USERNAME/two-tier-ecom-app:latest
```

---

### Phase 4: Verification & Live Endpoints

After deployment, test your application in the browser:

* 🌐 **Frontend Application:** `http://<YOUR_EC2_PUBLIC_IP>:3000`
* 🔌 **Backend Health Check:** `http://<YOUR_EC2_PUBLIC_IP>:5000/api/health`
* 📦 **Products API:** `http://<YOUR_EC2_PUBLIC_IP>:5000/api/products`

---

## 📡 API Reference Table

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/products` | Retrieve all products |
| `GET` | `/api/products/:id` | Retrieve product details by ID |
| `POST` | `/api/products` | Add a new product |
| `DELETE` | `/api/products/:id` | Remove a product |
| `GET` | `/api/orders` | Retrieve order history |
| `POST` | `/api/orders` | Submit a new order |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
