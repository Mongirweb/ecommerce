// pages/api/products/new.js
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await db.connectDb();

  try {
    const newProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json(newProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).json({ message: "Error fetching new products" });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler();
