# Seichi Map

This repository contains the Seichi Map (聖地巡礼マップ) web app, ready to deploy on GitHub Pages.

## Included
- index.html : Main app
- manifest.json : PWA manifest
- service-worker.js : Simple cache service worker
- posts.json : Sample posts
- icons/ : placeholder icons (replace with your images)

## How to deploy
1. Create a GitHub repository (public).
2. Upload all files to the repository root.
3. In GitHub repo settings -> Pages, set source to main branch / root.
4. Wait a minute and visit: https://<your-username>.github.io/<repo-name>/

## Notes
- Posts are stored in the browser's localStorage — they are not shared across users.
- To enable sharing between users, integrate a backend (e.g., Firebase) later.
