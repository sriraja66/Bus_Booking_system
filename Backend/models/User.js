import mongoose from 'mongoose';

// 1. Define the User Schema
// This tells Mongoose what a "User" should look like.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensures no two users can have the same email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'busUploader'],
    default: 'user'
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// 2. Create the User Model
// This creates a collection in MongoDB called "users" (Mongoose pluralizes the name)
const User = mongoose.model('User', userSchema);

export default User;
