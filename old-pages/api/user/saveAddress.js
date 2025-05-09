import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter().use(auth);

router.post(async (req, res) => {
  try {
    await db.connectDb(); // Ensure database connection
    const { address } = req.body;
    let user = await User.findById(req.user);
    await user.updateOne(
      {
        $push: {
          address: address,
        },
      },
      {
        new: true,
      }
    );
    user = await User.findById(req.user);
    await db.disconnectDb(); // Ensure database disconnection
    return res.status(200).json({ addresses: user.address });
  } catch (error) {
    await db.disconnectDb(); // Ensure database disconnection on error
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler();
