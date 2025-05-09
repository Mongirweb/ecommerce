import { styled } from "@material-ui/core";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const guestCartSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    email: { type: String },
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
    address: [
      {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        idType: { type: String },
        id: { type: String },
        phoneNumber: {
          type: String,
        },
        email: {
          type: String,
        },
        address1: {
          type: String,
        },
        address2: {
          type: String,
        },
        city: {
          type: String,
        },
        cityCode: {
          type: String,
        },
        zipCode: {
          type: String,
        },
        state: {
          type: String,
        },
        stateCode: {
          type: String,
        },
        country: {
          type: String,
        },
        countryCode: {
          type: String,
        },
        active: {
          type: Boolean,
          default: false,
        },
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

const GuestCart =
  mongoose?.models?.GuestCart || mongoose.model("GuestCart", guestCartSchema);

export default GuestCart;
