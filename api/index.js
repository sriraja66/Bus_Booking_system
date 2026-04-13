// Vercel Serverless Function entry point.
// Imports the Express app and exports it as the default handler.
// Vercel will call this function for every /api/* request.
import app from '../Backend/server.js';

export default app;
