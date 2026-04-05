import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Customer", "Supplier"],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Customer", customerSchema);
