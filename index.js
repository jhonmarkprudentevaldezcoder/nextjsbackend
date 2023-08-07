const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

mongoose.connect(
  "mongodb+srv://test:kHJMUpuEUurItgpQ@cluster.4wnoari.mongodb.net/database",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  res.send("Hey this is mySS API running 🥳");
});

/* app.get("/about", (req, res) => {
  res.send("This is my about route..... ");
}); */

// Export the Express API
module.exports = app;
