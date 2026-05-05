import Customer from "../models/Customer.js";

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;

    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    const customer = new Customer({ name, email, phone, company, address });
    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: "Invalid customer data" });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (customer) {
      res.json({ message: "Customer removed successfully" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
