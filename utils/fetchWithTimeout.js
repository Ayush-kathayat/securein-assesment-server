import fetch from "node-fetch"; // Ensure 'node-fetch' is installed if you use this in a Node.js environment.

const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
  // Increased timeout to 30 seconds
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request Timeout")), timeout)
  );

  return Promise.race([
    fetch(url, options), // The actual fetch request
    timeoutPromise, // Timeout promise
  ]);
};


export default fetchWithTimeout;