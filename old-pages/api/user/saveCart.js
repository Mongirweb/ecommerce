import { createRouter } from "next-connect";
import Product from "../../../models/Product";
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
const router = createRouter().use(auth);

const getProductDetails = async (cartItem) => {
  const dbProduct = await Product.findById(cartItem._id).lean();
  const subProduct = dbProduct.subProducts[cartItem.style];

  const price = Number(
    subProduct.sizes.find((p) => p.size === cartItem.size).price
  );
  const discountPrice =
    subProduct.discount > 0
      ? (price - price / Number(subProduct.discount)).toFixed(2)
      : price.toFixed(2);

  return {
    discount: Number(subProduct.discount),
    originalPrice: price.toFixed(2).toString(),
    name: dbProduct.name,
    product: dbProduct._id,
    color: {
      color: cartItem.color.color,
      image: cartItem.color.image,
    },
    image: subProduct.images[0].url,
    qty: Number(cartItem.qty),
    size: cartItem.size,
    price: discountPrice,
  };
};

const calculateCartTotal = (products) => {
  return products
    .reduce((total, product) => total + product.price * product.qty, 0)
    .toFixed(2);
};

const handlePostRequest = async (req, res) => {
  try {
    db.connectDb();
    const { cart } = req.body;

    const user = await User.findById(req.user);
    let existing_cart = await Cart.findOne({ user: user._id });

    if (existing_cart) {
      await Cart.deleteOne({ _id: existing_cart._id });
    }

    const products = await Promise.all(cart.map(getProductDetails));

    const cartTotal = calculateCartTotal(products);

    await new Cart({
      products,
      cartTotal,
      user: user._id,
    }).save();

    db.disconnectDb();
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    db.disconnectDb();
    res.status(500).json({ message: error.message });
  }
};

router.post(handlePostRequest);

export default router.handler();
