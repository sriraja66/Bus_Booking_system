import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

// Handle user registration
export const registerUser = async (req, res) => {
  try {
    // 1. Get user details from the request body
    const { username, email, password, role } = req.body;

    // 2. Make sure they provided all the required details
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password" });
    }

    // 3. Call the service to register the user
    const newUser = await authService.registerUser({ username, email, password, role: role || 'user' });
    
    // 4. Respond back to the client
    res.status(201).json({ 
        message: "User registered successfully", 
        user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Handle user login
export const loginUser = async (req, res) => {
  try {
    // 1. Get login details from the request body
    const { email, password, role } = req.body;

    // 2. Make sure they provided both details
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and login role" });
    }

    // 3. Call the service to log in the user (retrieves user based on email/password)
    const user = await authService.loginUser(email, password);
    
    // --- ROLE VALIDATION ---
    // 4. Check if the user's role matches the selected role during login
    if (user.role !== role) {
        return res.status(403).json({ 
            message: "Incorrect login type. Please login with the correct role." 
        });
    }

    // 5. Create a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    // 6. Respond back to the client with the token and user details
    res.status(200).json({ 
      message: "Login successful", 
      token: token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error) {
    // Return unauthorized status if login fails
    res.status(401).json({ message: error.message });
  }
};
