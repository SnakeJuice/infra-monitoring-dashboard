# 📊 Real-Time Infrastructure Telemetry Dashboard

An enterprise-ready, real-time system monitoring dashboard built with **Node.js**, **Express**, **WebSockets**, **React**, and **Docker**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 🚀 Features

- **Bi-Directional WebSockets:** Live streaming CPU and RAM metrics with minimal overhead using `ws`.
- **Interactive Visualizations:** Historical telemetry buffering visualized via streaming area charts powered by `Recharts`.
- **Docker Socket Integration:** Real-time container discovery and monitoring (CPU %, Memory usage, Status, Container ID) directly from the host system daemon via system socket mounting.
- **Production-Ready Containerization:** Multi-stage Docker builds serving the React frontend through an optimized Nginx server and backend via Node Alpine environment.

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js (v20+) with TypeScript
- **Framework:** Express & Native WebSockets (`ws`)
- **System Metrics:** `systeminformation`

### **Frontend**
- **Framework:** React 18 + Vite with TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Data Visualization:** Recharts

### **DevOps & Orchestration**
- **Containers:** Docker & Docker Compose
- **Web Server:** Nginx (Alpine)

---

## 📦 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) (v20+) _(Only if running locally without Docker)_.

### Running with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/tu-usuario/infra-monitoring-dashboard.git
   cd infra-monitoring-dashboard
   ```

2. Spin up the entire stack with a single command:
   ```bash
   docker compose up --build
   ```

3. Access the dashboard:
   - **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Backend Health Check:** [http://localhost:4000](http://localhost:4000)

---

## 📂 Project Structure

```text
infra-monitoring-dashboard/
├── client/                 # Vite + React + Tailwind Frontend
│   ├── src/
│   │   ├── App.tsx         # Real-time dashboard UI & Recharts stream
│   │   └── index.css
│   └── Dockerfile          # Multi-stage build (Node build -> Nginx serve)
├── server/                 # Express + WebSockets Backend
│   ├── src/
│   │   └── index.ts        # Telemetry collector & WebSocket emitter
│   └── Dockerfile          # Node.js Alpine container environment
├── docker-compose.yml      # Service orchestration & Docker socket binding
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.