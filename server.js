const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // ✅ ВАЖНО
let requests = [];

// ➕ ADD SONG
app.post("/add", (req, res) => {
  const { song, artist } = req.body;
  requests.push({ song, artist });
  res.redirect("/");
});

// 📡 API
app.get("/api", (req, res) => {
  res.json(requests);
});

// ❌ DELETE
app.post("/delete/:index", (req, res) => {
  requests.splice(req.params.index, 1);
  res.sendStatus(200);
});

// 🎵 USER PAGE (УЛТРА МОБИЛЕН ДИЗАЙН)
app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request a Song</title>

      <style>
        body {
          margin: 0;
          font-family: Arial;
          background: linear-gradient(135deg, #1db954, #191414);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .card {
          background: #121212;
          padding: 25px;
          border-radius: 20px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          text-align: center;
        }

        h1 {
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 15px;
          margin: 10px 0;
          border-radius: 12px;
          border: none;
          font-size: 16px;
          background: #1e1e1e;
          color: white;
        }

        input::placeholder {
          color: #aaa;
        }

        button {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          border-radius: 12px;
          border: none;
          background: #1db954;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }

        button:active {
          transform: scale(0.97);
        }
      </style>
    </head>

    <body>
      <div class="card">
        <h1>🎧 Request a Song</h1>

        <form method="POST" action="/add">
          <input name="song" placeholder="Song name" required>
          <input name="artist" placeholder="Artist name" required>
          <button type="submit">Send</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 🎧 DJ PANEL (МОДЕРЕН + МОБИЛЕН)
app.get("/dj", (req, res) => {
  res.send(`
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DJ Panel</title>

      <style>
        body {
          margin: 0;
          font-family: Arial;
          background: #111;
          color: white;
        }

        .container {
          padding: 15px;
          max-width: 500px;
          margin: auto;
        }

        h1 {
          text-align: center;
        }

        .song {
          background: #1e1e1e;
          padding: 15px;
          margin: 10px 0;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 10px rgba(0,0,0,0.4);
        }

        .text {
          font-size: 15px;
          max-width: 70%;
          word-wrap: break-word;
        }

        button {
          background: #ff4444;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        button:active {
          transform: scale(0.95);
        }
      </style>
    </head>

    <body>
      <div class="container">
        <h1>🎧 DJ Panel</h1>
        <div id="list"></div>
      </div>

      <script>
        async function load() {
          const res = await fetch('/api');
          const data = await res.json();

          let html = "";

          data.forEach((r, i) => {
            html += \`
              <div class="song">
                <div class="text">\${i+1}. \${r.song} - \${r.artist}</div>
                <button onclick="remove(\${i})">❌</button>
              </div>
            \`;
          });

          document.getElementById("list").innerHTML = html;
        }

        async function remove(i) {
          await fetch('/delete/' + i, { method: 'POST' });
          load();
        }

        setInterval(load, 1500);
        load();
      </script>
    </body>
    </html>
  `);
});

// 🚀 START
app.listen(3000, () => console.log("Server running on http://localhost:3000"));