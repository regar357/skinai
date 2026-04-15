require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoutes = require("./interfaces/routes/adminRoutes");

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, service: "admin-service" });
});

app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Admin service route not found",
  });
});

app.listen(port, () => {
  console.log(`Admin service listening on port ${port}`);
});
