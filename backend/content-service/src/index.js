require("dotenv").config();
const app = require("./interface/app");

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Content-Service listening on port ${PORT}`);
});
