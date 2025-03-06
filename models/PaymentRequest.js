import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Company" if you have a separate Company model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // e.g. 'pending', 'approved', 'rejected', 'paid', etc.
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected", "paid"],
    },
    // If needed, you can store a reference to the payout method (e.g., bank account, PayPal, etc.)
    paymentMethod: {
      type: String,
      default: "bank_transfer",
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// If you use the “compiled” approach to avoid recompiling the same model
const PaymentRequest =
  mongoose.models.PaymentRequest ||
  mongoose.model("PaymentRequest", paymentRequestSchema);

export default PaymentRequest;
