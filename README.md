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
    - On development, these are in `.env.example`, which you should copy to `.env` and edit with the appropriate values (see below).

Run `npm install` to install Node dependencies
    - This will also build the web app into `build`

### Production

- Run `npm start` and access the app at `http://localhost:3000` by default

### Maintenance

- Run `npm run scan_music` to scan the music directory and synchronise it with the database

### Development

- Run `npm run dev` to run a development server

## Environment variables:

- `MONGO_URI`: the URI to connect to a MongoDB instance
- `MUSIC_DIRECTORY`: where your music is stored
- `DISCOGS_CONSUMER_KEY`: Discogs key for album artwork
- `DISCOGS_CONSUMER_SECRET`: Discogs secret

