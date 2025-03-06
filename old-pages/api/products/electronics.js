import db from "../../../utils/db";
import Product from "../../../models/Product";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await db.connectDb();

  try {
    const electronicsCategoryID = "66b683eec2bd5f4688ba3e89"; // Replace with actual electronics category ID
    const electronicProducts = await Product.find({
      category: electronicsCategoryID,
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json(electronicProducts);
  } catch (error) {
    console.error("Error fetching electronic products:", error);
    res.status(500).json({ message: "Error fetching electronic products" });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler();
