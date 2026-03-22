#!/usr/bin/env bash
set -e

echo "Stopping Weather App..."

docker compose -f docker/docker_compose.yml down

docker compose -f docker/docker_compose_db.yml down

echo "App stopped"