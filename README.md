# Da-Bubble – Real-Time Chat Application (Slack Clone)

Da-Bubble is a modern real-time chat application inspired by Slack.  
It is built with Angular and focuses on scalable frontend architecture, real-time communication, and a clean, responsive user experience.

The project is designed as a production-style SaaS chat application with authentication, channel-based communication, and live data handling.


---

## Screenshots

### Authentication (Login)
![Login](assets/login.png)

### Chat Interface (Main View)
![Chat](assets/chat-main.png)

### Channel Management
![Channel](assets/new-channel.png)


---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [CI/CD Deployment](#cicd-deployment)
- [Running Locally](#running-locally)
- [Project Purpose](#project-purpose)
- [Extras](#extras)

---

## Features

- Real-time messaging powered by Firebase
- Channel-based communication structure
- Authentication via Firebase Auth
- Responsive and modern UI/UX design
- Message persistence via backend integration
- Live updates and reactive UI state handling
- Component-based Angular architecture
- Scalable and reusable UI components

---

## Tech Stack

**Frontend:**
- Angular
- TypeScript
- RxJS
- SCSS

**Backend / Data Layer:**
- Firebase (Authentication, Firestore Database)
- Real-time data synchronization
- Reactive data handling with Angular services

**Infrastructure:**
- Docker
- GitHub Actions (CI/CD)
- Linux VM deployment

---

## Architecture Overview

Da-Bubble is built with a strong focus on scalable frontend architecture:

- Modular Angular component structure
- Service-based data management
- Separation of UI, business logic, and data layers
- Reactive programming using RxJS for real-time updates
- Clean and maintainable folder structure
- Reusable UI components for scalability

### Key Engineering Focus

- Scalable frontend design patterns
- Real-time data flow handling
- Clean separation of concerns
- Maintainable application structure
- Production-oriented Angular architecture

---

## CI/CD Deployment

The project is fully containerized and automatically deployed using GitHub Actions, ensuring a fast and reliable production workflow.

### Deployment Pipeline

1. Code is pushed to the repository
2. GitHub Actions workflow is triggered
3. Docker images are built for frontend (and backend if applicable)
4. Images are pushed and deployed to a remote VM
5. Containers are restarted automatically
6. Application is instantly available in production

### Highlights

- Fully automated deployment pipeline
- Docker-based environment consistency
- Zero manual deployment effort
- Production-style workflow similar to real SaaS applications

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

## Project Purpose

This project was built to demonstrate:

- Advanced Angular frontend development skills  
- Real-time application architecture  
- Scalable state and component management  
- Integration of frontend with backend APIs  
- Production-level CI/CD pipeline setup  
- Dockerized deployment workflow  
- Ability to build SaaS-style applications with modern frontend architecture  

---

## Extras

- Can be extended with voice/video communication features  
- Role-based permissions and channel management possible  
- Notification system for real-time updates  
- WebSocket optimization for large-scale usage  
- Potential migration to microfrontend architecture  

---

> Note: This project represents a production-style frontend application with emphasis on scalable architecture, real-time communication, and modern deployment workflows.