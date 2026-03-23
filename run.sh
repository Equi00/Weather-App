#!/usr/bin/env bash
set -e

echo "Starting Weather App..."

docker compose -f docker/docker_compose_db.yml up --build -d

echo "Waiting for db to be ready..."
sleep 10

docker compose -f docker/docker_compose.yml up --build -d

echo ""
echo " - Application is running"
echo ""
echo "- Backend API:"
echo "   http://localhost:8000"
echo "   http://localhost:8000/docs"
echo ""
echo "- Frontend:"
echo "   http://localhost:5173"
echo ""
echo "- To stop the app run:"
echo "   ./stop.sh"
echo ""