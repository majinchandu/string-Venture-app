Library Management System
This project is a Library Management System built using the MERN stack (MongoDB, Express, React, Node.js) with Bootstrap for the frontend. It allows users to manage and interact with books in the library, including features for browsing, adding, and managing books.

Features
  User and Admin Authentication: Users can sign up, log in, and manage their sessions.
    Authentication is done using JWT Authentication
  Book Management: Admin users can add,  and delete books from the library.
  Browse and Borrow Books : Users can browse available books with details such as title, photo , author, publication Year , and availability.
  Responsive Design: The application is built with Bootstrap to ensure responsiveness across different devices.
  
Tech Stack
  Frontend: React.js, Bootstrap
  Backend: Node.js, Express.js
  Database: MongoDB
  
Authentication: JSON Web Tokens (JWT)

Installation
  Prerequisites
  Before starting, ensure you have the following installed:
  
  Node.js (for backend)
  npm (for managing frontend dependencies)
  MongoDB (or use MongoDB Atlas)
Setup
  Clone the repository


  git clone https://github.com/majinchandu/string-Venture-app.git
  cd string-Venture-app

Install backend dependencies
  Go to the backend directory and install dependencies:
  
  cd backend
  npm install

Install frontend dependencies
  Go to the frontend directory and install dependencies:


cd frontend
  npm install

Configure environment variables
  Create a .env file in both the frontend and backend directories to store sensitive information like database credentials and JWT secrets.

Example for backend .env:
makefile
Copy code
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
Run the application

For the backend, navigate to the backend directory and run:
  nodemon index.js
For the frontend, navigate to the frontend directory and run:
  npm start
The application should now be running locally on your browser.

Usage
Sign Up / Log In: Users need to sign up and log in to interact with the system.
Browse and Manage Books: Users can browse and borrow  available books and perform various actions based on their role (user/admin).

This is a Assignment for hiring process for String Venture on-campus placement 
