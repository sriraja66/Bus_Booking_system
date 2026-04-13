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

    // 2. Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and login role" });
    }

    // ── Role normalisation ────────────────────────────────────────────────────
    // The frontend sends "user" or "busUploader".
    // The DB stores "user" or "busUploader" (see User model enum).
    // Accepted frontend values → DB values:
    const ROLE_MAP = {
      'user':        'user',
      'busUploader': 'busUploader',
      // legacy alias sent by older UIs — kept for safety
      'uploader':    'busUploader',
    };
    const dbRole = ROLE_MAP[role];
    if (!dbRole) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // 3. Validate email + password (service throws INVALID_CREDENTIALS if wrong)
    const user = await authService.loginUser(email, password);

    // 4. Role check — after credentials are confirmed valid
    //    This is the ONLY place a 403 should be produced.
    if (user.role !== dbRole) {
      return res.status(403).json({ message: "Incorrect login type" });
    }

    // 5. Issue JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Success
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });

  } catch (error) {
    // Only credential errors reach here (code === 'INVALID_CREDENTIALS')
    // Everything else (DB outage etc.) also surfaces here as 401 which is fine
    // for security (don't leak server internals).
    return res.status(401).json({ message: "Invalid email or password" });
  }
};