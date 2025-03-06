import { styled } from "@material-ui/core";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        subProduct: {
          type: ObjectId,
          ref: "Product.subProducts",
        },
        uid: {
          type: String,
        },
        name: {
          type: String,
        },
        image: {
          type: String,
        },
        size: {
          type: String,
        },
        style: {
          type: String,
        },
        /*
        style: {
          style: String,
          color: String,
          image: String,
        },
        */
        qty: {
          type: Number,
        },
        sku: { type: String },
        color: {
          color: String,
          image: String,
        },
        discount: {
          type: Number,
        },
        originalPrice: {
          type: String,
        },
        price: String,
        wholesalePrice: String,
        fromShopify: Boolean,
        idShopify: String,
        measures: {
          long: String,
          width: String,
          high: String,
          volumetric_weight: String,
        },
        variant: String,
        weight: String,
        company: {
          type: ObjectId,
          ref: "Company",
        },
        companyName: String,
      },
    ],
    cartTotal: Number,
    wholeSaleTotal: Number,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose?.models?.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
