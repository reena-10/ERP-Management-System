import mongoose from "mongoose";

const grnSchema = new mongoose.Schema(
  {
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    receivedItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantityReceived: { type: Number, required: true, min: 1 },
      },
    ],
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("GRN", grnSchema);
