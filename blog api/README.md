# Blog API

A RESTful Blog API built with Node.js, Express.js, MongoDB and Mongoose.

## Features

- Create users
- Create, read, update and delete posts
- Create comments
- Get all comments
- Get comments for a specific post
- MongoDB relationships using ObjectId references
- Mongoose `populate()`
- Centralized error handling
- Validation and duplicate-key error handling
- Layered architecture using Routes, Controllers and Models

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

## Project Structure

```text
blog-api/
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── controllers/
│   ├── userController.js
│   ├── postController.js
│   └── commentController.js
├── routes/
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── commentRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js