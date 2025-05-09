import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const reviewSchema = new mongoose.Schema({
  reviewBy: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  review: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  style: {
    color: String,
    image: String,
  },
  fit: {
    type: String,
  },
  images: [],
  likes: [],
});

reviewSchema.index({ rating: 1 });
const productSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      //lowercase: true,
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    subCategories: [
      {
        type: ObjectId,
        ref: "subCategory",
      },
    ],
    subCategorie2: [
      {
        type: ObjectId,
        ref: "subCategory2",
      },
    ],
    subCategorie3: [
      {
        type: ObjectId,
        ref: "subCategory3",
      },
    ],

    fromShopify: {
      type: Boolean,
      default: false,
    },

    details: [
      {
        name: String,
        value: String,
      },
    ],
    questions: [
      {
        question: String,
        answer: String,
      },
    ],
    reviews: [reviewSchema],
    refundPolicy: {
      type: String,
      default: "30 days",
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
    },
    subProducts: [
      {
        idShopify: String,
        sku: String,
        universalCode: String,
        images: [],
        description_images: [],
        gender: String,
        warranty: {
          number: { type: Number, required: true },
        },
        weight: String,
        flashOffer: String,
        chargeMarket: {
          type: Number,
          default: 10,
        },
        measures: {
          long: { type: String },
          width: { type: String },
          high: { type: String },
          volumetric_weight: { type: String },
        },
        color: {
          color: {
            type: String,
          },
          image: {
            type: String,
          },
        },
        sizes: [
          {
            size: String,
            qty: Number,
            wholesalePrice: Number,
            price: Number,
            sku: String,
            universalCode: String,
            priceWithDiscount: {
              type: Number,
              default: 0,
            },
            priceWithDiscountFlash: {
              type: Number,
              default: 0,
            },
          },
        ],
        discount: {
          type: Number,
          default: 0,
        },

        variant: String,

        flashDiscount: {
          type: Number,
          default: 0,
        },
        sold: {
          type: Number,
          default: 0,
        },
        soldInFlash: {
          type: Number,
          default: 0,
        },
        totalSold: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// normal B-tree index for uniqueness

// Add ONE single text index:
productSchema.index(
  {
    name: "text",
    brand: "text",
    description: "text",
    slug: "text",
  },
  {
    weights: {
      name: 5,
      brand: 3,
      description: 1,
      slug: 1,
    },
    name: "ProductTextIndex",
  }
);

const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);

export default Product;
