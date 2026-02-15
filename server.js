// Create express variable, set up the server, etc:
const express = require("express");
const app = express();
const port = 3000;

// Allow Express to read form data:
app.use(express.urlencoded({ extended: true }));

// Store feedback in memory as objects
let feedbackList = [];
let currentId = 1;

// Serve the HTML page:
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle feedback submission
app.post("/submit", (req, res) => {
  const feedbackText = req.body.feedback;

  const newFeedback = {
    id: currentId++,
    message: feedbackText,
    status: "Received"
  };

  feedbackList.push(newFeedback);

  // Send confirmation page with ID and status
  res.send(`
    <h2>Thank you for your feedback!</h2>
    <p><strong>Your Feedback ID:</strong> ${newFeedback.id}</p>
    <p><strong>Status:</strong> ${newFeedback.status}</p>
    <a href="/">Go Back</a>
  `);
});

// Check status route
app.get("/status/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const feedback = feedbackList.find(f => f.id === id);

  if (!feedback) {
    return res.send("<h3>Feedback not found.</h3>");
  }

  res.send(`
    <h2>Feedback Status</h2>
    <p><strong>ID:</strong> ${feedback.id}</p>
    <p><strong>Status:</strong> ${feedback.status}</p>
    <a href="/">Go Back</a>
  `);
});

// Admin view: see feedback anonymously
app.get("/admin", (req, res) => {
  const formatted = feedbackList
    .map(f => `ID: ${f.id} | ${f.message} | Status: ${f.status}`)
    .join("<br>");

  res.send(formatted || "No feedback submitted yet.");
});

// Server listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});