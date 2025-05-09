import { createRouter } from "next-connect";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
import User from "../../../models/User";
import business from "../../../middleware/business";
const router = createRouter().use(auth).use(business);

router.put(async (req, res) => {
  try {
    db.connectDb(); // Ensure database connection
    const { info } = req.body;
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateOne(
      {
        businessName: info.businessName,
        businessDescription: info.businessDescription,
        employeeNumber: info.employeeNumber,
        businessAddress: info.businessAddress,
        businessState: info.businessState,
        businessCity: info.businessCity,
        businessCountry: info.businessCountry,
        businessEmail: info.businessEmail,
        businessPhoneNumber: info.businessPhoneNumber,
        businessId: info.businessId,
        businessCategory: info.businessCategory,
        businessStartDate: info.businessStartDate,
      },
      {
        new: true,
      }
    );

    await db.disconnectDb(); // Ensure database disconnection
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    await db.disconnectDb(); // Ensure database disconnection on error
    return res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
});

export default router.handler();
