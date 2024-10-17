const path = require("path");
const express = require("express");
const app = express();

const DIST_DIR = path.join(__dirname, "dist", "archimedes-frontend", "browser");
app.use(express.static(DIST_DIR));

app.get("/*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

