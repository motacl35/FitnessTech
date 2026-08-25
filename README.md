# FitnessTech

FitnessTech is a full-stack fitness and gym membership web application. Users can create an account, log in, manage their profile, select or update a membership, update payment information, submit contact messages, view workouts, track fitness activity, and use an AI-powered Fitness Helper.

This README is for the `FTechAI` branch, which includes the Google Gemini-powered Fitness Helper.

## Technology Stack

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **AI:** Google Gemini API
- **Development Tools:** VS Code, npm, nodemon, Git, and Docker

## Requirements

Install the following before running the project:
- Node.js
- npm
- Docker Desktop
- Git
- Google Gemini API key

## Download the Project

Clone the `FTechAI` branch:

```bash
git clone -b FTechAI https://github.com/motacl35/FitnessTech.git
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

Install the server dependencies:

```bash
cd server
npm install
```

Install the client dependencies:

```bash
cd ../client
npm install
cd ..
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```text
server/.env
```

Add:

```env
MONGO_URI=mongodb://localhost:27017/fitnesstech
JWT_SECRET=replace_with_your_secret_key
PORT=3001
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

The Gemini API key can be created through Google AI Studio.

**Never commit the `.env` file or API keys to GitHub.**

## Start MongoDB

Make sure Docker Desktop is running.

From the root project folder:

```bash
docker compose up -d
```

Verify that MongoDB is running:

```bash
docker ps
```

## Run the Application

From the root project folder:

```bash
npm run dev
```

This starts both the backend server and React client.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Health Check: `http://localhost:3001/api/health`

## Main Features

- User registration and login
- JWT authentication
- Protected user profiles
- Profile information and picture updates
- Password updates
- Gym membership selection and updates
- Payment method updates
- Contact form
- Workout videos
- Workout tracking
- Responsive navigation
- AI-powered Fitness Helper

## Fitness Helper

FitnessTech includes a Fitness Helper powered by the Google Gemini API.

The Fitness Helper:

- Appears in the bottom-right corner of the website
- Remains available while navigating between pages
- Can be minimized and reopened
- Answers fitness and workout-related questions

### Guest Users

Guest users can use the Fitness Helper without logging in. Their conversation remains while navigating between pages but is cleared when the browser is refreshed.

Guest conversations are not saved to MongoDB.

### Logged-In Users

Logged-in users have persistent AI conversations stored in MongoDB.

Users can:

- Start new conversations
- Continue previous conversations
- Have multiple saved conversations
- Delete individual conversations
- Refresh the page without losing saved conversations

## Troubleshooting

If port `3001` is already in use:

```bash
lsof -i :3001
```

Stop the conflicting process:

```bash
kill <PID>
```

If MongoDB port `27017` is already being used:

```bash
docker ps
```

Stop the conflicting MongoDB container if necessary, then run:

```bash
docker compose up -d
```

## Branch

This version of FitnessTech is maintained on the:

```text
FTechAI
```

branch.

## Author

Developed as the FitnessTech capstone project.