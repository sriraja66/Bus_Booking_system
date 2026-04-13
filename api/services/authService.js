import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Register a new user
export const registerUser = async (userData) => {
  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // 2. Hash the password before saving (security best practice)
    // saltRounds = 10 is standard for bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // 3. Create a new user with the hashed password
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user'
    });

    // 4. Save the new user to the database
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

// Login an existing user — only validates email & password.
// Role checking is handled by the controller.
export const loginUser = async (email, password) => {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // Use a tagged error so the controller knows this is a credentials failure
    const err = new Error("Invalid email or password");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // 2. Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  return user; // Return the full user document; caller decides role logic
};
