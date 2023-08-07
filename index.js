import mongoose from "mongoose";
import express from "express";

const express = require("express");

const app = express();
const PORT = 4000;

// Connect to MongoDB using your provided connection string
mongoose.connect(
  "mongodb+srv://test:kHJMUpuEUurItgpQ@cluster.4wnoari.mongodb.net/database",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define a MongoDB schema and model (if needed)
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  // ... other fields
});

const UserModel = mongoose.model("users", UserSchema);

app.get("/", async (req, res) => {
  try {
    // Example: Fetch and send users from MongoDB
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/a", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.get("/about", (req, res) => {
  res.send("This is my about route..... ");
});

// Export the Express API
module.exports = app;
