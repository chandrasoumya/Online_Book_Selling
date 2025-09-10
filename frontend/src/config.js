// Centralized configuration for frontend
// Reads the backend base URL from environment variable
// Ensure to define REACT_APP_API_URL in frontend/.env

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


