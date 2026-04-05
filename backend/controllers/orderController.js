import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    // .populate() fetches the actual customer and product details instead of just IDs
    const orders = await Order.find({})
      .populate("party", "name email company")
      .populate("items.product", "name sku")
      .populate("preparedBy", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { orderType, party, items, totalAmount } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = await Order.create({
      orderType,
      party,
      items,
      totalAmount,
      preparedBy: req.user._id, // Taken from the auth token
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Order Status (GRN / Dispatch Logic)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order is being marked as Completed, update inventory
    if (status === "Completed" && order.status !== "Completed") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          if (order.orderType === "Purchase") {
            product.stock += item.quantity; // GRN: Add to inventory
          } else if (order.orderType === "Sales") {
            product.stock -= item.quantity; // Dispatch: Remove from inventory
          }
          await product.save();
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
