# Master Step-by-Step AWS Deployment Guide using Docker (No Nginx & No AWS RDS)

This document is your **complete end-to-end roadmap** to manually containerize and deploy your **Two-Tier E-Commerce Web Application** (React Frontend + Express Backend + Local JSON Database) to an **AWS EC2 Instance** using **Docker & Docker Compose**.

---

## 🗺️ Master Execution Checklist (Start Here ➔ Finish Here)

Follow these phases strictly from top to bottom:

- [ ] **PHASE 1: Prepare Docker & Local Project Files** (On Local Computer)
  - [ ] 1.1 Create `backend/Dockerfile`
  - [ ] 1.2 Create `frontend/Dockerfile` (using Node `serve`)
  - [ ] 1.3 Create root `docker-compose.yml` (with local volume persistence)
  - [ ] 1.4 Update API URL in `frontend/src/api/client.js`
  - [ ] 1.5 Push project code to GitHub (or prepare for SCP upload)

- [ ] **PHASE 2: Set Up AWS Cloud Infrastructure** (On AWS Console)
  - [ ] 2.1 Log into AWS Management Console & open EC2
  - [ ] 2.2 Launch EC2 Instance (`Ubuntu 22.04 LTS`, `t2.micro` Free Tier)
  - [ ] 2.3 Create Security Group with Inbound Rules (Ports `22`, `3000`, `5000`)
  - [ ] 2.4 Download & save SSH Key Pair (`my-key.pem`)

- [ ] **PHASE 3: Connect to EC2 & Install Docker Engine** (In Terminal)
  - [ ] 3.1 SSH into EC2 instance (`ssh -i my-key.pem ubuntu@<EC2_IP>`)
  - [ ] 3.2 Update Linux packages (`sudo apt update && sudo apt upgrade -y`)
  - [ ] 3.3 Install Docker & Docker Compose (`sudo apt install -y docker.io docker-compose-v2`)
  - [ ] 3.4 Add `ubuntu` user to `docker` group & reconnect SSH

- [ ] **PHASE 4: Deploy Application Code to EC2** (In Terminal)
  - [ ] 4.1 Clone Git repository on EC2 (`git clone <YOUR_REPO_URL> app`)
  - [ ] 4.2 Enter project folder (`cd app`)

- [ ] **PHASE 5: Build & Run Docker Containers** (On EC2)
  - [ ] 5.1 Run `docker compose up --build -d`
  - [ ] 5.2 Verify container status (`docker compose ps`)
  - [ ] 5.3 Inspect container logs if needed (`docker compose logs -f`)

- [ ] **PHASE 6: Verification & Testing** (In Web Browser)
  - [ ] 6.1 Test React Frontend: `http://<EC2_PUBLIC_IP>:3000`
  - [ ] 6.2 Test Express API Health: `http://<EC2_PUBLIC_IP>:5000/api/health`
  - [ ] 6.3 Test Products API: `http://<EC2_PUBLIC_IP>:5000/api/products`
  - [ ] 6.4 Test Order creation & confirm `db.json` volume persistence

---

## 🏛️ Visual Architecture & Flow Diagrams

### 1. High-Level Visual Architecture Diagram
![AWS VPC Docker Architecture](C:\Users\mihir\.gemini\antigravity-ide\brain\5584d5a2-598d-4aad-92e7-40660537ed9c\aws_vpc_docker_architecture_1785854840859.png)

### 2. Enterprise 2-Subnet Architecture Diagram (Optional Production Upgrade)
![AWS 2-Subnet VPC Architecture](C:\Users\mihir\.gemini\antigravity-ide\brain\5584d5a2-598d-4aad-92e7-40660537ed9c\aws_2subnet_vpc_architecture_1785855077134.png)

---

## 💾 No AWS RDS Needed! How Database Persistence Works

You **do NOT need AWS RDS** for this project! AWS RDS adds extra cost and complexity.

Instead, your backend manages data using local storage (`db.json`) and **Docker Volumes**:

1. **How it works without RDS**:
   - The backend service writes products and orders into `backend/data/db.json` ([db.js](file:///d:/PROJECTS/new_project/backend/src/db.js)).
   - In `docker-compose.yml`, we mount `./backend/data:/app/data`.
   - When you stop, restart, or update your Docker container on EC2, your product catalog and orders will **NOT be lost**.

---

## 📖 DETAILED STEP-BY-STEP INSTRUCTIONS

### PHASE 1: Prepare Docker & Local Project Files

#### Step 1.1: Create `backend/Dockerfile`
Create `backend/Dockerfile` with this exact content:
```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

#### Step 1.2: Create `frontend/Dockerfile` (No Nginx)
Create `frontend/Dockerfile` with this exact content:
```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```

#### Step 1.3: Create root `docker-compose.yml`
Create `docker-compose.yml` in your root project folder:
```yaml
version: '3.8'

services:
  # Tier 2: Express API Backend Service
  backend:
    build: ./backend
    container_name: ecom_backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/data:/app/data
    restart: always

  # Tier 1: React Frontend Service
  frontend:
    build: ./frontend
    container_name: ecom_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: always
```

#### Step 1.4: Update API Base URL in `frontend/src/api/client.js`
In `frontend/src/api/client.js`, update line 1:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

---

### PHASE 2: Set Up AWS Cloud Infrastructure

1. Log into your **AWS Management Console** -> Go to **EC2**.
2. Click **Launch Instance**.
3. **Instance Name**: `ecom-2tier-server`
4. **OS Image (AMI)**: **Ubuntu 22.04 LTS**
5. **Instance Type**: `t2.micro` (Free Tier)
6. **Key Pair**: Create new key pair `my-key.pem` and download it to your PC.
7. **Network Settings (Security Group Inbound Rules)**:
   Add 3 Inbound Rules:
   - **SSH**: Port `22` | Source: Anywhere (`0.0.0.0/0`)
   - **Custom TCP**: Port `3000` | Source: Anywhere (`0.0.0.0/0`) [React Frontend]
   - **Custom TCP**: Port `5000` | Source: Anywhere (`0.0.0.0/0`) [Backend API]
8. Click **Launch Instance**.

---

### PHASE 3: Connect to EC2 & Install Docker Engine

1. Open terminal on your computer, navigate to your `.pem` key location, and run:
   ```bash
   ssh -i "my-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

2. Update system and install Docker + Docker Compose:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose-v2
   sudo systemctl enable docker
   sudo systemctl start docker
   sudo usermod -aG docker ubuntu
   ```

3. Exit SSH and log back in to apply group permissions:
   ```bash
   exit
   ssh -i "my-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

---

### PHASE 4: Deploy Application Code to EC2

Clone your Git repository onto your EC2 server:
```bash
git clone https://github.com/your-username/your-repo-name.git app
cd app
```

*(Alternative: Upload direct folder via SCP from local terminal)*:
```bash
scp -i "my-key.pem" -r d:/PROJECTS/new_project ubuntu@<YOUR_EC2_PUBLIC_IP>:~/app
```

---

### PHASE 5: Build & Run Docker Containers

1. Inside `~/app` on EC2, run:
   ```bash
   docker compose up --build -d
   ```

2. Check container status:
   ```bash
   docker compose ps
   ```

3. If status shows `Up`, both services are live!

---

### PHASE 6: Verification & Testing

Open your browser and verify:
- 🌐 **Frontend UI**: `http://<YOUR_EC2_PUBLIC_IP>:3000`
- ⚙️ **Backend Health**: `http://<YOUR_EC2_PUBLIC_IP>:5000/api/health`
- 📦 **Products API**: `http://<YOUR_EC2_PUBLIC_IP>:5000/api/products`

---

## 🛠️ Quick Commands Cheat Sheet

| Action | Command (Run on EC2) |
| :--- | :--- |
| **Start Containers** | `docker compose up --build -d` |
| **Stop Containers** | `docker compose down` |
| **View Live Logs** | `docker compose logs -f` |
| **Check Container Status** | `docker compose ps` |
