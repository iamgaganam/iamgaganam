import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Initializes React application with strict mode
 */

// Get root element with proper error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find root element. Please ensure your HTML has a div with id='root'"
  );
}

// Create React root and render application
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
