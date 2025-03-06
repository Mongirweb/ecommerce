// pages/api/products/offers.js
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await db.connectDb();

  try {
    const offersProducts = await Product.find({
      "subProducts.discount": { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json(offersProducts);
  } catch (error) {
    console.error("Error fetching offer products:", error);
    res.status(500).json({ message: "Error fetching offer products" });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler();
