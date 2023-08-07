const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

//default route
app.get("/", (req, res) => {
  res.send("NODE API");
});

app.get("/blog", (req, res) => {
  res.send("blog api");
});

// fetch all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a product

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register user
app.post("/register", async (req, res) => {
  // Check for a valid JWT token in the request headers
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing or invalid token." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), "your-secret-key");

    // At this point, the token is valid
    // You can use the decoded information, e.g., decoded.userId, to perform further checks

    // Create a new user using the data from the request body
    const user = await User.create(req.body);

    // Respond with a status of 200 (OK) and the created user data
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Set the token as a cookie (optional)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Respond with the token as a Bearer token
    res
      .status(200)
      .json({ message: "Authentication successful", token: `${token}` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//check authentication

function authenticateToken(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing or invalid token." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), "your-secret-key");

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
}

app.get("/protected", authenticateToken, (req, res) => {
  // If the middleware passes, the user is authenticated
  // You can access the user information from req.user
  res.status(200).json({
    message: "Protected resource accessed by user: " + req.user.userId,
  });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://admin:v6ZVz4v4oks1zskk@cluster0.msxip.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
