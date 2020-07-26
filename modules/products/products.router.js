require("dotenv").config();
const express = require("express");
const products_modal = require("./products.model");

const router = express.Router();

router.use(express.json());
const PAGINATIONLIMIT = 9;
// GET ALL PRODUCTS
router.get("/all-products", async (req, res) => {
  const pagination = req.query.pagination ? parseInt(req.query.pagination) : PAGINATIONLIMIT;

  const page = req.query.page ? parseInt(req.query.page) : 1;

  const products = await products_modal
    .find({})
    .select(
      `-_id
                                          name
                                          price
                                          img
                                          desc
                                          qty
                                          `
    )
    .skip((page - 1) * pagination)
    .limit(pagination);
  res.status(200).json(products);
});

// ONE PRODUCT
router.get("/all-products/:id", async (req, res) => {
  const product = await products_modal.findById(req.params.id).select(`-_id name
  price
  img
  `);
  if (!product) return res.status(404).json({ status: "Product not found." });
  res.status(200).json(product);
});

module.exports = router;
