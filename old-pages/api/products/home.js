// pages/api/products/home.js
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await db.connectDb();

  try {
    const homeCategoryID = "66b683f5c2bd5f4688ba3e8e"; // Replace with actual home category ID
    const homeProducts = await Product.find({ category: homeCategoryID })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json(homeProducts);
  } catch (error) {
    console.error("Error fetching home products:", error);
    res.status(500).json({ message: "Error fetching home products" });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler();
