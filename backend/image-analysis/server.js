require("dotenv").config();

const cors = require("cors");
const express = require("express");
const path = require("path");

const apiRoutes = require("./interfaces/routes");
const { env } = require("./infrastructure/config/env");
const {
  errorHandler,
  notFoundHandler,
} = require("./infrastructure/middlewares/errorHandler");

const app = express();
const port = process.env.PORT || env.port || 3001;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.json({ success: true, service: "image-analysis-service" });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  try {
    app.listen(port, () => {
      console.log(`Image analysis service listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to bootstrap image analysis server", error);
    process.exit(1);
  }
}

bootstrap();
