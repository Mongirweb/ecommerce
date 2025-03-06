// utils/updateProducts.js

import db from "./db"; // Adjust the path accordingly
import Product from "../models/Product"; // Adjust the path accordingly

export async function updateProducts() {
  try {
    // Connect to the database
    await db.connectDb();

    // Update products in bulk
    const result = await Product.updateMany(
      {}, // Match all products
      [
        {
          $set: {
            subProducts: {
              $map: {
                input: "$subProducts",
                as: "subProduct",
                in: {
                  $let: {
                    vars: {
                      discount: { $ifNull: ["$$subProduct.discount", 0] },
                      flashDiscount: {
                        $ifNull: ["$$subProduct.flashDiscount", 0],
                      },
                    },
                    in: {
                      $mergeObjects: [
                        "$$subProduct",
                        {
                          sizes: {
                            $map: {
                              input: "$$subProduct.sizes",
                              as: "size",
                              in: {
                                $mergeObjects: [
                                  "$$size",
                                  {
                                    priceWithDiscount: {
                                      $subtract: [
                                        "$$size.price",
                                        {
                                          $divide: [
                                            {
                                              $multiply: [
                                                "$$size.price",
                                                "$$discount",
                                              ],
                                            },
                                            100,
                                          ],
                                        },
                                      ],
                                    },
                                    priceWithDiscountFlash: {
                                      $subtract: [
                                        "$$size.price",
                                        {
                                          $divide: [
                                            {
                                              $multiply: [
                                                "$$size.price",
                                                "$$flashDiscount",
                                              ],
                                            },
                                            100,
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ]
    );

    // Disconnect from the database
    await db.disconnectDb();
  } catch (error) {
    console.error("Error updating products:", error);
  }
}
