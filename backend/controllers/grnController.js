import GRN from "../models/GRN.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Get all GRNs
// @route   GET /api/grn
export const getGRNs = async (req, res) => {
  try {
    const grns = await GRN.find({})
      .populate({
        path: "purchaseOrder",
        populate: { path: "customer", select: "name company" }, // Gets Supplier info
      })
      .populate("receivedItems.product", "title sku")
      .sort({ createdAt: -1 });
    res.json(grns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
};

// @desc    Create a new GRN (Receive Goods)
// @route   POST /api/grn
export const createGRN = async (req, res) => {
  try {
    const { purchaseOrder, receivedItems, notes } = req.body;

    // 1. Verify the order exists and is a Purchase Order
    const order = await Order.findById(purchaseOrder);
    if (!order || order.orderType !== "Purchase") {
      return res.status(400).json({ message: "Invalid Purchase Order" });
    }

    if (order.status === "Completed") {
      return res
        .status(400)
        .json({ message: "This order has already been received." });
    }

    // 2. Increase Inventory Stock
    for (let item of receivedItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += Number(item.quantityReceived); // Add to inventory!
        await product.save();
      }
    }

    // 3. Mark the original Purchase Order as Completed
    order.status = "Completed";
    await order.save();

    // 4. Save the Official GRN Record
    const grn = new GRN({ purchaseOrder, receivedItems, notes });
    const createdGRN = await grn.save();

    res.status(201).json(createdGRN);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to process GRN." });
  }
};
