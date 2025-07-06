const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const headlines = [
  "Why Cake and Co is Mumbai's Sweetest Spot in 2025",
  "Discover the Secret Behind Cake and Co's Recipes",
  "Mumbai's Sweet Sensation: Why Everyone Loves Cake and Co",
  "Top Reasons Cake and Co leads the Sweets Section",
];

app.get("/business-data", (req, res) => {
  const { name, location } = req.query;

  res.json({
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 300),
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    name: name || "Cake & Co",
    location: location || "Mumbai",
  });
});

app.post("/business-data", (req, res) => {
  const { name, location } = req.body;
  console.log("Received:", req.body);

  res.json({
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 300),
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    name: name || "Cake & Co",
    location: location || "Mumbai",
  });
});

app.get("/regenerate-headline", (req, res) => {
  res.json({
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
