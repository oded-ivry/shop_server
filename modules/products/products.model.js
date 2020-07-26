const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsScema = new Schema({
  name: String,
  price: String,
  desc: String,
  inCart: Boolean,
  img: String,
});

const Products_Model = mongoose.model("products", productsScema);

module.exports = Products_Model;
