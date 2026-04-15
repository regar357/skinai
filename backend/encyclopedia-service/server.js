require("dotenv").config();
const express = require("express");
const cors = require("cors");
const encyclopediaRoutes = require("./interfaces/routes/encyclopediaRoutes");

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, service: "encyclopedia-service" });
});

app.use("/api/diseases", encyclopediaRoutes.diseasesRouter);
app.use("/api/admin/diseases", encyclopediaRoutes.adminDiseasesRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Encyclopedia service route not found",
  });
});

app.listen(port, () => {
  console.log(`Encyclopedia service listening on port ${port}`);
});
