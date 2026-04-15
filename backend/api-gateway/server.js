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

// /api/admin/diseases/**  백과사전 생성, 수정 서비스 (임시 포트 3003)
app.use(
  "/api/admin/diseases",
  createProxyMiddleware({
    target: encyclopediaTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin/diseases": "/api/admin/diseases",
    },
  }),
);

// /api/diseases/**  백과사전 서비스 (임시 포트 3003)
app.use(
  "/api/diseases",
  createProxyMiddleware({
    target: encyclopediaTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/diseases": "/api/diseases",
    },
  }),
);

// /api/admin/**  어드민 서비스 (임시 포트 3002)
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
