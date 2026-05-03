const { createApp } = require("./app");

const port = Number(process.env.PORT || 3004);
const { app } = createApp();

app.listen(port, () => {
  console.log(`diagnosis-service listening on ${port}`);
});
