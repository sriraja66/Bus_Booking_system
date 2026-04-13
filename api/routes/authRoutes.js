import express from 'express';
import { registerUser, loginUser } from '../Controllers/authController.js';

const router = express.Router();

// Define the route for user registration
// When a POST request is made to /register, call the registerUser function in the controller
router.post('/register', registerUser);

// Define the route for user login
// When a POST request is made to /login, call the loginUser function in the controller
router.post('/login', loginUser);

export default router;
