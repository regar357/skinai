require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3001;
const adminTarget =
  process.env.ADMIN_SERVICE_URL || "http://admin-service:3002";
const encyclopediaTarget =
  process.env.ENCYCLOPEDIA_SERVICE_URL || "http://encyclopedia-service:3003";

app.use(cors());
app.use(express.json());

app.use(
  "/api/v1/encyclopedia",
  createProxyMiddleware({
    target: encyclopediaTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/encyclopedia": "/api/v1/encyclopedia",
    },
  }),
);

app.use(
  "/api/admin",
  createProxyMiddleware({
    target: adminTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin": "/api/admin",
    },
  }),
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Gateway route not found",
  });
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
