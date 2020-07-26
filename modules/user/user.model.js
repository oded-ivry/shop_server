// require("dotenv").config();

const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// const { APP_SECRET } = process.env;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  user_name: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// UserSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this.id }, APP_SECRET);
//   return token;
// };
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
