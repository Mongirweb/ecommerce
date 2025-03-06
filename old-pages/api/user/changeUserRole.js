import { createRouter } from "next-connect";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
import User from "../../../models/User";

const router = createRouter().use(auth);

router.post(async (req, res) => {
  await db.connectDb(); // Ensure database connection
  try {
    const { code } = req.body;
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (code === "fenalquista2024") {
      await user.updateOne(
        {
          role: "business",
        },
        {
          new: true,
        }
      );

      user = await User.findById(req.user); // Fetch updated user data
      await db.disconnectDb(); // Ensure database disconnection

      return res
        .status(200)
        .json({ message: "User successfully converted to business", user });
    } else {
      return res.status(400).json({ message: "codigo invalido" });
    }
  } catch (error) {
    await db.disconnectDb(); // Ensure database disconnection on error
    return res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
});

export default router.handler();
