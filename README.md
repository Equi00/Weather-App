# Weather Application

Name: Ezequiel Oyola

## PM Accelerator Mission

The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, this program has helped over hundreds of students fulfill their career aspirations.

## Overview

This project is a simple weather web application that allows users to create, edit, search, delete and download weather data.

All data is persisted in a NoSQL database using an ORM. No in-memory storage or mocks are used.

---

## Tech Stack

### Backend
- **Python**: 3.14.2
- **FastAPI**: 0.135.1
- **MongoDB**: latest
- **Pydantic**: 2.12.5
- **uvicorn**:0.30.1
- **pymongo**: 4.16.0
- **requests**: 2.32.5
- **httpx**: 0.28.1
- **pytest**: 9.0.2
- **Docker**: 3.9

### Frontend
- **React**: 19.2.4
- **Node.js**: 24.12.0 (LTS)
- **npm**: 11.6.2
- **Vite**: 8.0.1
- **Chakra UI**: 2.7.1

### Testing
- **Pytest**
- **FastAPI TestClient**
- **MongoDB test database**

### Infrastructure
- **Docker**
- **Docker Compose**
- **Bash/Zsh startup script**

---

### Features

- Search weather data
- Create weather data forecast or with a data range
- Delete weather data from the database
- Filter weather data by city and country
- Weathers data are persisted in the database

---

## Docker Setup

The application is split into **two Docker Compose configurations**:

### Database (docker_compose_db.yml)

- Runs a MongoDB:latest container
- Persists data using a Docker volume

### Application (docker_compose.yml)

- Backend: FastAPI application
- Frontend: React application
- Backend connects to the database using Docker networking

---

## Running the Application

### Prerequisites

- Docker
- Docker Compose
- Bash (Linux/macOS or WSL on Windows)

### Start the app

From the project root, run:
- ./run.sh

This script will:

1. Start the MongoDB container

2. Wait for the database to be ready

3. Start the backend and frontend containers

4. Expose the services locally

### Access the application

- **Backend API**:

http://localhost:8000

http://localhost:8000/docs

- **Frontend**:

http://localhost:5173

---

## Stopping the Application

From the project root, run:
- ./stop.sh

## Starting and stopping the Application from local

Start the database with:
- docker compose -f docker/docker_compose_db.yml up --build -d

From the backend folder, run:
- uvicorn main:app --reload

from the frontend folder, run:
- npm run dev
