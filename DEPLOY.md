# Deployment Guide

This application is a standard Node.js application that uses Express for the backend and React (Vite) for the frontend. It can be easily deployed to any platform that supports Node.js (Google Cloud Run, Heroku, Railway, Render, etc.).

## Prerequisites

- Node.js 18+
- An API Key for Google Gemini (Cloud AI)

## Environment Variables

You need to set the following environment variables in your deployment environment:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

## Build & Run

The application is configured to build the frontend and serve it via the Express backend.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Build the Frontend:**
    ```bash
    npm run build
    ```
    This compiles the React app into the `dist/` folder.

3.  **Start the Server:**
    ```bash
    npm start
    ```
    This runs `tsx server.ts`, which serves the API and the static files from `dist/`.

## Deploying to Google Cloud Run (Example)

1.  **Containerize:** Create a `Dockerfile` (if not using Buildpacks).
2.  **Deploy:**
    ```bash
    gcloud run deploy cloud-ai-workspace --source .
    ```

## Deploying to Heroku

1.  **Create App:**
    ```bash
    heroku create
    ```
2.  **Set Config Vars:**
    ```bash
    heroku config:set GEMINI_API_KEY=...
    ```
3.  **Deploy:**
    ```bash
    git push heroku main
    ```
