# Project Setup

This project consists of a **Next.js** frontend and a **FastAPI** backend, both containerised using Docker. The easiest way to start both services is by using Docker Compose.

## Prerequisites

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Starting the Project

To start both the frontend and backend services, run the following command:

```
docker compose up --build
```

This command will:

1. Build the Docker images for both the frontend (Next.js) and backend (FastAPI).
2. Start the containers as defined in your `docker-compose.yml`.

## Accessing the Services

- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend (FastAPI)**: [http://localhost:8000](http://localhost:8000)

## Stopping the Project

To stop the running containers, press **Ctrl + C** in the terminal or run:

```
docker compose down
```

## Logs & Debugging

To view logs for a specific service, use:

```
docker compose logs -f <service-name>
```

Replace `<service-name>` with the name of the service defined in `docker-compose.yml`, such as `frontend` or `backend`.

## Notes

- Ensure that your `docker-compose.yml` file correctly maps ports (`3000` for frontend, `8000` for backend) and mounts volumes if needed.
- If you make code changes, rerun `docker compose up --build` to rebuild the images.

