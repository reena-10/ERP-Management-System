import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    // Populate pulls in the actual Customer and Product data instead of just the IDs
    const orders = await Order.find({})
      .populate("customer", "name email company")
      .populate("items.product", "title sku")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { customer, orderType, items } = req.body;
    let totalAmount = 0;

    // Step 1: Pre-check stock levels for Sales Orders to prevent partial failures
    if (orderType === "Sale") {
      for (let item of items) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.title}. Only ${product.stock} left.` });
        }
      }
    }

    // Step 2: Calculate totals and update inventory
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      item.price = product.price; // Lock in the current price
      totalAmount += (item.price * item.quantity);

      if (orderType === "Sale") {
        product.stock -= item.quantity; // Deduct inventory for sales
        await product.save();
      }
      // Note: If orderType === "Purchase", stock is NOT added here. 
      // It will be added later when the GRN (Goods Receipt Note) is processed.
    }

    // Step 3: Save the Order
    const order = new Order({ customer, orderType, items, totalAmount });
    const createdOrder = await order.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create order. Please check your inputs." });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) res.json({ message: "Order removed successfully" });
    else res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};