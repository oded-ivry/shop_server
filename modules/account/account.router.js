// require("dotenv").config();

const verifyToken = require("../user/verifyToken");
const express = require("express");

// const { APP_SECRET } = process.env;
const router = express.Router();

router.use(express.json());

// Test api returns an object sent in request body or "hello from router"
router.get("/hello", (req, res) => {
  // res.status(200).json(req.body);
  res.send("Test from account");
});

// Test protected route
router.get("/", verifyToken, async (req, res) => {
  res.status(200).send("hello from account");
});

module.exports = router;
