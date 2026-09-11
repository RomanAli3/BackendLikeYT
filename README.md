# 🎬 VideoHub Backend

A RESTful backend for a YouTube-style video platform built with Node.js, Express.js, MongoDB and Mongoose.

## 🚀 Features

### 👤 User & Authentication
- User Registration / Login / Logout
- JWT Authentication
- Get Current User
- Change Profile Picture
- Change Cover Image
- Change Password
- Change Full Name

### 🎥 Videos
- Upload Video
- Get All Videos
- Get Single Video
- Get User Videos
- Update Video
- Delete Video
- Video Views Counter

### 💬 Comments
- Add Comment
- Delete Comment
- Get Video Comments
- Populate Comment User Data

### ❤️ Likes
- Like / Unlike Video
- Get Video Likes
- Get Like Count

### 🔔 Subscriptions
- Subscribe / Unsubscribe Channel
- Get Subscriber Count

### 📺 Channel
- Get Channel Information
- Get Channel Subscriber Count
- Get Channel Video Count

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Multer
- Nodemailer
- Postman

## 🔐 Security

- JWT based authentication
- Protected routes
- User ownership validation
- Password protection
- Environment variables for sensitive data

## ☁️ Media Storage

Cloudinary is used for storing uploaded videos, profile pictures, cover images and thumbnails.

## 📡 API

The backend provides REST APIs for users, videos, comments, likes, subscriptions and channels.

## 📂 Project Structure

```text
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── db/
├── app.js
└── index.js
