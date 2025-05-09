import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Please enter your full name.",
    },
    email: {
      type: String,
      required: "Please enter your email address.",
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: '"Please enter a password.',
    },
    provider: { type: String, default: "credentials" },
    role: {
      type: String,
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    defaultPaymentMethod: {
      type: String,
      default: "",
    },

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
    wishlist: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        style: {
          type: String,
        },
      },
    ],
    deliveredOrders: [
      {
        type: ObjectId,
        ref: "Order",
      },
    ],
    businessName: {
      type: String,
    },
    businessDescription: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    businessDevolutionAdress: {
      type: String,
    },
    businessState: {
      type: String,
    },
    businessCity: {
      type: String,
    },
    businessCountry: {
      type: String,
    },
    nameOfPersonInCharge: {
      type: String,
    },
    businessEmail: {
      type: String,
    },
    businessPhoneNumber: {
      type: String,
    },
    businessId: {
      type: String,
    },

    bussinesBank: {
      type: String,
    },
    bussinesBankAccountNumber: {
      type: String,
    },
    bussinesBankAccountType: {
      type: String,
    },
    acceptTerms: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);
const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
