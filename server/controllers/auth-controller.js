const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = (req, res) => {
  const { username, password } = req.body;
  console.log("Received credentials:", username, password);
  console.log(
    "Expected credentials:",
    process.env.ADMIN_USERNAME,
    process.env.ADMIN_PASSWORD
  );

  // Check if the provided credentials match the environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const user = { username };
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = { login };
