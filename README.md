# FitnessTech

FitnessTech is a full-stack fitness and gym membership web application. Users can create an account, log in, manage their profile, select or update a membership, update a payment method, submit contact messages, view workouts, and track fitness activity.

## Technology Stack

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB
- **Database Library:** Mongoose
- **Authentication:** JSON Web Tokens
- **Development Tools:** VS Code, npm, nodemon, and Docker

## Project Structure

```text
FitnessTech/
├── client/
├── server/
├── node_modules/
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md   
```

## Requirements

Install the following before running the project:

- Node.js
- npm
- Docker Desktop
- Git

## Download the Project

Clone the repository:

```bash
git clone https://github.com/motacl35/FitnessTech.git
```

Open the project folder:

```bash
cd FitnessTech
```

## Install Dependencies

Install the root dependencies:

```bash
npm install
```
### Start MongoDB
```bash
docker compose up -d
```
### Run the application
```bash 
npm run dev
```

## Environment Variables

Create a file named `.env` inside the `server` folder:

```text
server/.env
```

Add the required environment variables:

```env
MONGO_URI=mongodb://localhost:27017/fitnesstech
JWT_SECRET=replace_with_your_secret_key
PORT=3001
```

## Start MongoDB with Docker

Make sure Docker Desktop is running.

Create and start the MongoDB container:

```bash
docker run -d   --name fitnesstech-mongo   -p 27017:27017   -v fitnesstech-data:/data/db   mongo:7
```

Check that the container is running:

```bash
docker ps
```

To restart the container later:

```bash
docker start fitnesstech-mongo
```

## Run the Application

From the root project folder, run:

```bash
npm run dev
```

This command starts both the backend server and the React client.

Open the application in a browser:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:3001
```

Test the backend health route:

```text
http://localhost:3001/api/health
```

## Main Features

- User registration and login
- Protected profile page
- Profile information updates
- Profile picture upload
- Password updates
- Gym membership selection and updates
- Payment method updates
- Contact form
- Workout videos
- Workout tracking
- Responsive navigation menu

## Author

Developed as the FitnessTech capstone project.
