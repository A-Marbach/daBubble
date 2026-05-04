# Da-Bubble – Real-Time Chat Application with Kubernetes Orchestration

Da-Bubble is a production-ready real-time chat application (Slack Clone) with enterprise-grade Kubernetes orchestration and automated CI/CD deployment.

Built with Angular frontend and Firebase backend, the project demonstrates production-style DevOps practices including Docker containerization, Kubernetes orchestration, and automated security scanning in CI/CD pipelines.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [CI/CD Deployment](#cicd-deployment)
- [Kubernetes](#kubernetes)
- [Running Locally](#running-locally)
- [Security](#security)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Architecture Overview](#architecture-overview)
- [Project Purpose](#project-purpose)
- [Extras](#extras)

---

## Features

- **Docker containerization for production deployment**
- **Kubernetes orchestration (minikube)**
- **Automated CI/CD pipeline with GitHub Actions**
- **Security scanning via CodeQL (SAST)**
- Real-time data synchronization with Firebase
- Responsive and scalable application architecture
- Production-ready deployment workflow
- Zero-downtime deployment capability

---

## Tech Stack

**Infrastructure & DevOps:**
- Docker
- GitHub Container Registry (GHCR)
- GitHub Actions (CI/CD)
- Kubernetes (minikube)
- Linux VM deployment

**Frontend:**
- Angular
- TypeScript
- RxJS
- SCSS

**Backend / Data Layer:**
- Firebase (Authentication, Firestore Database)
- Real-time data synchronization
- Reactive data handling with Angular services

---

## CI/CD Deployment

The project is fully containerized and automatically deployed using GitHub Actions, ensuring a fast and reliable production workflow.

### Pipeline Steps

1. **Build** – Angular app is built and dependencies are cached
2. **Test** – Angular unit tests run in headless Chrome
3. **Scan** – SAST security analysis via CodeQL
4. **Docker** – Image is built and pushed to GHCR
5. **Deploy** – Container is deployed to remote VM via SSH

### Highlights

- Fully automated deployment pipeline
- Docker build cache for faster builds
- SAST security scanning with CodeQL on every push
- Zero manual deployment effort
- Production-style workflow similar to real SaaS applications

---

## Kubernetes

The application is orchestrated with Kubernetes using the following manifests located in the `k8s/` folder:

- **deployment.yaml** – defines the Pod and container configuration
- **service.yaml** – exposes the application within the cluster
- **ingress.yaml** – routes external traffic to the service via hostname

### Run locally with minikube

```bash
minikube start
minikube addons enable ingress
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
minikube service da-bubble --url
```

---

## Running Locally

### Prerequisites

- Node.js
- Angular CLI
- Docker (optional)

### Setup

```bash
git clone git@github.com:A-Marbach/da-bubble.git
cd da-bubble
npm install
ng serve
```

## Application URL

```bash
http://localhost:4200
```

---

## Security

### Best Practices

❌ Do not commit `.env` files, Firebase keys, or any sensitive information to the repository.
❌ Do not include API keys or credentials in the frontend code.
✅ Use GitHub Secrets for all sensitive environment variables (Firebase credentials, etc.).
✅ Store Firebase configuration in environment files (`.env` in `.gitignore`).

### Automated Security Scanning (CI/CD Pipeline)

Every push triggers a security pipeline before any image is built or deployed. The pipeline implements security best practices with scanning at each stage.

**Security Pipeline Flow**

```
Push to GitHub
       ↓
Build Angular Application
       ↓
Run Unit Tests
       ↓
SAST Security Scan (CodeQL) 🔴 CRITICAL
       ↓
Build Docker Image
       ↓
Push to GHCR
       ↓
Deploy to VM
```

**Stage: Static Application Security Testing (CodeQL)**

Tool: CodeQL

- Performs static code analysis (SAST) on the Angular application
- Detects potential security vulnerabilities
- Identifies common web application vulnerabilities (XSS, Injection, etc.)
- Blocks the pipeline if critical issues are found
- Configuration: GitHub Actions workflow

Status: 🔴 CRITICAL – Pipeline fails if critical vulnerabilities detected

---

## GitHub Actions Deployment

The deployment workflow uses GitHub Actions to automate the entire build, test, security scan, and deployment process.

### Workflow Overview

```
1. Code Push to GitHub
   ↓
2. Build Angular Application
   ↓
3. Run Unit Tests
   ↓
4. Run Security Scan (CodeQL)
   ↓
5. Build Docker Image
   ↓
6. Push to GitHub Container Registry (GHCR)
   ↓
7. Deploy to VM (pull images, restart containers)
```

### Workflow File

Location: `.github/workflows/main.yaml`

### Required Secrets

Store these in GitHub repository settings under Settings → Secrets and variables → Actions:

| Secret | Description | Example |
|--------|-------------|---------|
| `GHCR_PAT` | GitHub Personal Access Token for container registry | `ghp_1234567890...` |
| `SSH_HOST` | Target VM hostname or IP | `192.168.1.100` |
| `SSH_USER` | SSH username for VM deployment | `deploy` |
| `SSH_KEY` | SSH private key for authentication | (Multi-line private key) |
| `SSH_PORT` | SSH port | `22` |

### Notes

- The VM no longer builds images itself – it only pulls pre-built images from GHCR
- All security checks run before any image is built or pushed
- Deployment is fully automated after successful security gates

---

## Architecture Overview

Da-Bubble is built with focus on production-ready DevOps and scalable architecture:

### DevOps & Infrastructure
- Container orchestration with Kubernetes (minikube)
- Automated CI/CD with GitHub Actions
- Security scanning with CodeQL (SAST)
- Production-style deployment to Linux VM via SSH
- Scalable architecture ready for SaaS environments

### Frontend Architecture
- Modular Angular component structure
- Service-based data management
- Separation of UI, business logic, and data layers
- Reactive programming using RxJS for real-time updates
- Clean and maintainable folder structure
- Reusable UI components for scalability

---

## Project Purpose

This project was built to demonstrate:

- Container orchestration with Kubernetes
- Production-level CI/CD pipeline with security scanning (CodeQL)
- Dockerized deployment workflow
- Automated security gates and scanning
- Real-time application architecture
- Scalable state and component management
- Integration of frontend with backend APIs
- Ability to build production-ready SaaS applications

---

## Extras

- Can be extended with voice/video communication features
- Role-based permissions and channel management possible
- Notification system for real-time updates
- WebSocket optimization for large-scale usage
- Potential migration to microfrontend architecture

---

> Note: This project represents a production-style application with emphasis on DevOps orchestration, scalable architecture, real-time communication, and modern deployment workflows suitable for enterprise environments.
