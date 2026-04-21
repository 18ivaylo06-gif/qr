const express = require("express");
const path = require("path");
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// memory storage
let requests = [];

// ➕ ADD SONG
app.post("/add", (req, res) => {
  const { song, artist, language } = req.body;

  requests.push({
    song,
    artist,
    language
  });

  res.sendStatus(200);
});

// 📡 API
app.get("/api", (req, res) => {
  res.json(requests);
});

// ❌ DELETE
app.post("/delete/:index", (req, res) => {
  const i = parseInt(req.params.index);

  if (!isNaN(i)) {
    requests.splice(i, 1);
  }

  res.sendStatus(200);
});

// 🎵 USER PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🎧 DJ PANEL
app.get("/dj", (req, res) => {
  res.sendFile(path.join(__dirname, "dj.html"));
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});