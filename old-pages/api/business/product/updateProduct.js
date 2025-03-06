import { createRouter } from "next-connect";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import auth from "../../../../middleware/auth";
import business from "../../../../middleware/business";

const router = createRouter().use(auth).use(business);

router.put(async (req, res) => {
  try {
    db.connectDb();

    // Fetch the product by ID
    const product = await Product.findById(req.body._id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // // Check if the current user is the owner of the product
    // if (product.company.toString() !== req.user.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to update this product." });
    // }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.body._id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({
      message: "Producto actualizado con exito",
      product: updatedProduct,
    });

    db.disconnectDb();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
