const express = require("express");
const app = express();
const port = 3000;

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // needed for JSON requests

// Serve static files
app.use(express.static(__dirname + "/public"));

// In-memory feedback storage
let feedbackList = [];

// Home page: user feedback submission
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  const feedback = req.body.feedback;
  if (feedback) {
    // Store feedback as an object with empty reply
    feedbackList.push({ feedback: feedback, reply: "" });
  }
  res.sendFile(__dirname + "/public/confirmation.html");
});

// Admin page: view & submit feedback
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// API route: manager fetches all feedback
app.get("/api/feedback", (req, res) => {
  // Send feedback as JSON array of objects
  res.json(feedbackList);
});

// API route: manager or admin posts a reply
app.post("/api/feedback/:index/reply", (req, res) => {
  const index = parseInt(req.params.index);
  const reply = req.body.reply;

  if (!feedbackList[index]) return res.status(404).send("Feedback not found");

  // Update the reply
  feedbackList[index].reply = reply;
  res.send("Reply saved");
});

app.get("/review", (req, res) => {
  res.sendFile(__dirname + "/public/review.html");
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
