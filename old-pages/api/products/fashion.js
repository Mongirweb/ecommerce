import db from "../../../utils/db";
import Product from "../../../models/Product";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await db.connectDb();

  try {
    const fashionCategoryID = "66b683b6c2bd5f4688ba3e67"; // Replace with actual fashion category ID
    const fashionProducts = await Product.find({ category: fashionCategoryID })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json(fashionProducts);
  } catch (error) {
    console.error("Error fetching fashion products:", error);
    res.status(500).json({ message: "Error fetching fashion products" });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler();
