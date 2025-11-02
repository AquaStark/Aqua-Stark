// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel deployment

import app from '../backend/src/index.js';

// Export the Express app as a Vercel serverless function
export default app;
