const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const noticeRoutes = require("./routes/noticeRoutes");
const encyclopediaRoutes = require("./routes/encyclopediaRoutes");
const { errorHandler } = require("../infrastructure/middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/notices", noticeRoutes);
app.use("/encyclopedia", encyclopediaRoutes);

app.use(errorHandler);

module.exports = app;
