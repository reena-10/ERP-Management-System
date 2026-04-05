import Customer from "../models/Customer.js";

// @desc    Get all customers and suppliers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new customer or supplier
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { type, name, email, phone, address, company } = req.body;

    // Check agar email pehle se exist karta hai
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Naya record banayein
    const customer = await Customer.create({
      type,
      name,
      email,
      phone,
      address,
      company,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
