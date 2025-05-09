import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: false,
    },
    guestToken: {
      type: String, // <-- nuevo
    },
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
        price: {
          type: Number,
        },
        wholesalePrice: {
          type: Number,
        },
        fromShopify: {
          type: Boolean,
          default: false,
        },
        idShopify: {
          type: String,
        },
        company: {
          type: ObjectId,
          ref: "Company",
        },
        measures: {
          long: { type: String },
          width: { type: String },
          high: { type: String },
          volumetric_weight: { type: String },
        },
        variant: {
          type: String,
        },
        companyName: {
          type: String,
        },
        weight: {
          type: String,
        },
        pickedUp: {
          type: Boolean,
          default: false,
        },
        pickedUpAt: {
          type: Date,
        },
      },
    ],
    companies: [
      {
        type: ObjectId,
        ref: "Company",
      },
    ],
    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      id: {
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
      state: {
        type: String,
      },
      stateCode: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
      countryCode: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: String,
      status: String,
      email: String,
    },
    total: {
      type: Number,
      required: true,
    },
    wholeSaleTotal: {
      type: Number,
    },
    totalBeforeDiscount: {
      type: Number,
    },
    couponApplied: {
      type: String,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      default: "Procesando",
      enum: [
        "Procesando",

        "Exitoso",
        "En reclamación",
        "Cancelado",
        "Devuelto",
      ],
    },
    deliveryStatus: {
      type: String,
      default: "En recolección",
      enum: [
        "En recolección",
        "Pendiente de envio",
        "Enviado",
        "Entregado",
        "Cancelado",
        "Completado",
      ],
    },
    paidAt: {
      type: Date,
    },
    deliveryID: {
      type: String,
    },
    deliveryUrl: {
      type: String,
    },
    deliveredBy: {
      type: String,
      default: "No Seleccionada",
      enum: ["Coordinadora", "No Seleccionada", "Deprisa", "InterRapidismo"],
    },
    trackingInfo: {
      carrier: {
        type: String,
      },
      service: {
        type: String,
      },
      price: {
        type: Number,
      },
      email: {
        type: String,
      },
      trackingNumber: {
        type: String,
      },
      trackingUrl: {
        type: String,
      },
      trackingLabel: {
        type: String,
      },
    },
    deliveredAt: {
      type: Date,
    },
    messengerStatus: {
      type: String,
      type: String,
      default: "Sin empacar",
      enum: [
        "Sin empacar",
        "En proceso de empacar",
        "Empacado",
        "Entregado a transportador",
        "Cancelado",
      ],
    },
    messengerId: {
      type: ObjectId,
      ref: "User",
    },
    inBagProductsInfos: {
      image: {
        type: String,
      },
      productsQty: {
        type: Number,
      },
      createdAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    },
    photoDelivered: {
      image: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    },
    return: [
      {
        open: {
          type: Boolean,
          default: false,
          enum: [false, true],
        },
        reason: {
          type: String,
          default: "",
        },
        solution: {
          type: String,
          default: "",
          moneyReturned: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
    devolutiondeliveryStatus: [
      {
        status: {
          type: String,
          default: "",
          enum: ["Pendiente envio", "Sin devolver", "Devuelto"],
        },
        deliveryID: {
          type: String,
        },
        deliveryUrl: {
          type: String,
        },
        deliveredBy: {
          type: String,
          default: "Coordinadora",
          enum: ["Coordinadora"],
        },
        deliveredAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
