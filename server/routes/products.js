const express = require("express");
const Product = require("../models/Product");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/", authenticate, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;