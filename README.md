# nmusic2

Node-based music player and organiser

## Architecture

- Node.js backend API
- React-Redux frontend

- Node version: 8

## Instructions:

### Installation:

- Install external dependencies
    - MongoDB

- Set environment variables
    - These are in `.env.example`, which you should copy to `.env` and edit with the appropriate values (see below).

Run `npm install` to install Node dependencies
    - This will also build the web app into `build`

### Production

- Run `npm start` and access the app at `http://localhost:3000` by default

### Maintenance

- [TODO] Run `npm run load_music` to process music files into the database

### Development

- Run `npm run dev:wds` to run a development web app

- Run `npm run dev:api` to run a development backend server

## Environment variables:

- `MONGO_URI`: the URI to connect to a MongoDB instance

