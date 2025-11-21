JobFindr

JobFindr is a modern job application platform where users can search for jobs, apply for positions, and for employers to post new job opportunities. It’s designed to be responsive, fast, and user-friendly, with features like job filtering, liking/bookmarking jobs, and real-time updates.

Features

User authentication using Auth0

Browse and search jobs with filters (Full-time, Part-time, Contract, Internship)

Like/bookmark jobs for later

View job details and applicants

Post and manage jobs (for employers)

Responsive UI with grid, table, and list views

Backend connected to MongoDB for job and user data

Tech Stack

Frontend: Next.js, React, Tailwind CSS

Backend: Node.js, Express

Database: MongoDB

Authentication: Auth0

Deployment: Frontend on Netlify, Backend on Render

Setup & Installation

Clone the repository

git clone https://github.com/your-username/jobfindr.git
cd jobfindr


Install dependencies

# Backend
cd server
npm install

# Frontend
cd ../frontend
npm install


Environment variables

Create a .env file in the server folder with the following keys:

SECRET=your-auth0-secret
CLIENT_ID=your-auth0-client-id
BASE_URL=http://localhost:5000
ISSUER_BASE_URL=your-auth0-domain
CLIENT_URL=http://localhost:3000
MONGO_URI=your-mongodb-connection-string


Run the application locally

# Backend
cd server
npm start

# Frontend
cd ../frontend
npm run dev


Open your browser and go to http://localhost:3000 to see the application.

Deployment

Frontend: Deploy on Netlify

Backend: Deploy on Render

Ensure all environment variables are added on the hosting platforms.

License

This project is licensed under the MIT License.
