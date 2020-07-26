require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const raw = require("../../middleware/route.async.wrapper");
const verifyToken = require("../user/verifyToken");
const { registerValidate, loginValidate } = require("./validations");

const { APP_SECRET } = process.env;

//define router as an express.router instance which is
//a small mini app within the app and it allows us to easily have
//in component routing and middleware
const router = express.Router();

//allows router the ability to json parse
router.use(express.json());

//get the user model schema
const user_model = require("./user.model");
// const { deleteAccount } = require("../account/account.router");

// test api returns an object sent in request body or "hello from routerd"
router.get(
  "/hello",
  raw((req, res) => {
    // res.status(200).json(req.body);
    res.send("hello from router");
  })
);

// Raw is an express builtin middleware that parses incoming request payloads
// const raw = require("../../middleware/route.async.wrapper");

// GET ALL USERS
router.get(
  "/all-users",
  raw(async (req, res) => {
    const users = await user_model.find({}).select(`-_id
                                          name
                                          user_name
                                          email
                                          `);
    /* password; */
    res.status(200).json(users);
  })
);

// GET A USER
router.get(
  "/user/:user_name",
  raw(async (req, res) => {
    const user = await user_model.find({ user_name: req.params.user_name })
      .select(`-_id
                                          name
                                          user_name
                                          email
                                          `);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

// GETS A SINGLE USER by id
//Added - before password
router.get(
  "/user/:id",
  raw(async (req, res) => {
    const user = await user_model.findById(req.params.id).select(`-_id 
                                        name 
                                        user_name 
                                        email`);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

// CREATES A NEW USER
router.post(
  "/reg-user",
  raw(async (req, res) => {
    const { error } = registerValidate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await user_model.findOne({ email: req.body.email });
    if (user) return res.status(400).json("User already registered.");

    const salt = await bcrypt.genSalt(10);

    user = await user_model.create(req.body);
    user.password = await bcrypt.hash(req.body.password, salt);
    const savedUser = await user.save();
    res.status(200).send({
      id: user._id,
      name: user.name,
      user_name: user.user_name,
      email: user.email,
    });
    console.log(req.body, `${user.user_name} is now a registered user.`);
  })
);

//Allows user log in
router.post(
  "/login-user",
  raw(async (req, res) => {
    const { error } = loginValidate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await user_model.findOne({ user_name: req.body.user_name });
    // .select(`user_name name email`);

    if (!user) return res.status(400).json("User not found.");

    const validPassowrd = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassowrd)
      return res.status(400).json("Invalid user name or passowrd.");

    user.password = undefined;
    delete user.password;

    console.log(user);
    //below we should return a json web token
    const token = jwt.sign({ _id: user.id }, APP_SECRET);

    res.status(200).json({ token, user });
  })
);

//Get current user
router.get(
  "/me",
  verifyToken,
  raw(async (req, res) => {
    // console.log(req.user_id);
    const user = await user_model.findById(req.user_id).select(`_id
                                        name
                                        user_name
                                        email`);

    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

module.exports = router;
