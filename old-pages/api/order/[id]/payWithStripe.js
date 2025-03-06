import { createRouter } from "next-connect";
import auth from "../../../../middleware/auth";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = createRouter().use(auth);

router.post(async (req, res) => {
  try {
    await db.connectDb();
    const { amount, id } = req.body;
    const order_id = req.query.id;
    const payment = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      description: "M74JJI Store",
      payment_method: id,
      confirm: true,
      return_url: "http://localhost:3000/checkout",
    });
    const order = await Order.findById(order_id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Processing";
      order.paymentResult = {
        id: payment.id,
        status: payment.status,
        email_address: payment.email_address,
      };
      await order.save();
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
    db.disconnectDb();
  } catch (error) {
    console.error(error);
    db.disconnectDb();
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
