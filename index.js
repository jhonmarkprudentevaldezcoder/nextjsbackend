const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://test:kHJMUpuEUurItgpQ@cluster.4wnoari.mongodb.net/database",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Log a message when connected
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
