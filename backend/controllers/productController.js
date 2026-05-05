import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

export const createProduct = async (req, res) => {
  try {
    const { title, sku, price, stock } = req.body;
    const product = new Product({ title, sku, price, stock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid data or Duplicate SKU" });
  }
};
