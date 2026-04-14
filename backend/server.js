require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express Backend");
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
