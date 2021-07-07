# MIT Project

To run this project, ensure you have a recent version of Node.js installed.

1) Install dependencies by running `npm i` in both the `/mit-front` and `/mit-back` directories.

2) Create a `.env` file within the `/mit-back` directory, containing the uri to a MongoDB database in the following format:
```
mongo=URI
```

3) Run `npm run start` in both the `/mit-front` and `/mit-back` directories.

The client web-app will be accessible at `http://localhost:3000/` with the server running on port 3001.