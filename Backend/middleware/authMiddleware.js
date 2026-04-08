import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token from the Authorization header.
 * Attaches the decoded userId to the req.user object.
 */
const authMiddleware = (req, res, next) => {
  // Skip authentication for preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return next();
  }

  // 1. Get the token from the header
  // Format: Authorization: Bearer <TOKEN>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  // 2. Extract the token (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using the same JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user data from the token to the request object
    // This allows subsequent handlers (controllers) to know who is logged in
    req.user = decoded;

    // 5. Carry on to the next function (the controller)
    next();
  } catch (error) {
    // If the token is invalid or expired, return an error
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
