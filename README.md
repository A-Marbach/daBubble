# Da-Bubble – Real-Time Chat Application with Kubernetes

Da-Bubble is a production-ready real-time chat application built with Angular and Firebase.
The project is designed as a production-style SaaS chat application with Kubernetes orchestration, automated CI/CD deployment, and enterprise-grade security scanning.

---

## Table of Contents

- [Quickstart](#quickstart)
- [Usage](#usage)
- [Kubernetes](#kubernetes)
- [Running Locally](#running-locally)
- [Security](#security)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Extras](#extras)

---

## Quickstart

### Prerequisites

- Node.js
- Angular CLI
- Docker
- Kubernetes / minikube (for orchestration)
- GitHub Actions enabled (for automated build & deployment)

### Steps

Clone this repository:
```bash
git clone git@github.com:A-Marbach/da-bubble.git
cd da-bubble
```

Install dependencies:
```bash
npm install
```

Build the Angular application:
```bash
ng build
```

Build the Docker image:
```bash
docker build -t da-bubble:latest .
```

Run locally (development):
```bash
ng serve
```

Open the application in your browser:
```
http://localhost:4200
```

---

## Usage

Navigate to the application URL to use Da-Bubble.

The application provides real-time messaging with Firebase backend integration.

Make sure all environment variables are correctly set before starting.

---

## Kubernetes

The application is orchestrated with Kubernetes using the following manifests located in the `k8s/` folder:

- **deployment.yaml** – defines the Pod and container configuration
- **service.yaml** – exposes the application within the cluster  
- **ingress.yaml** – routes external traffic to the service via hostname

### Run locally with minikube

```bash
# Start minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Get service URL
minikube service da-bubble --url
```

### Restart and Stop Minikube

```bash
# Restart minikube
minikube restart

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete
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

### Application URL

```
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
Stage 1: Code Scanning (CodeQL) 🔴 CRITICAL
       ↓
Build Docker Image
       ↓
Push to GHCR
       ↓
Deploy to VM
```

### Stage 1: Code Scanning

Tool: CodeQL

- Performs static application security testing (SAST) on the Angular codebase
- Detects potential security vulnerabilities in the source code
- Identifies common web application vulnerabilities (XSS, SQL Injection, etc.)
- Blocks the pipeline if critical security issues are found
- Configuration: GitHub Actions workflow

Status: 🔴 **CRITICAL** – Pipeline fails if critical vulnerabilities detected

---

## GitHub Actions Deployment

The deployment workflow uses GitHub Actions to automate the entire build, security scan, and deployment process.

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

## Extras

- Can be extended with voice/video communication features
- Role-based permissions and channel management possible
- Notification system for real-time updates
- WebSocket optimization for large-scale usage
- Extend the security pipeline by adding more scanning tools (e.g., npm audit, OWASP Dependency-Check, etc.)

---

> Note: This project represents a production-style application with emphasis on Kubernetes orchestration, scalable architecture, real-time communication, and modern deployment workflows.
