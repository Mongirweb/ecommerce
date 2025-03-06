import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
const router = createRouter().use(auth);
router.put(async (req, res) => {
  try {
    db.connectDb();
    const { product_id, style } = req.body;
    const user = await User.findById(req.user);
    const exist = user.wishlist.find(
      (x) => x.product == product_id && x.style == style
    );
    if (exist) {
      return res
        .status(400)
        .json({ message: "Este producto ya existe en tu lista de deseos." });
    }
    await user.updateOne({
      $push: {
        wishlist: {
          product: product_id,
          style,
        },
      },
    });
    db.disconnectDb();
    res.status(200).json({ message: "Producto añadido a tu lista de deseos." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler();
