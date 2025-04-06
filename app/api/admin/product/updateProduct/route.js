import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import auth from "../../../../../middleware/auth";
import admin from "../../../../../middleware/admin";
import slugify from "slugify";
import sanitizeHtml from "sanitize-html";

// Middleware to handle authentication and business check
async function middleware(req) {
  await auth(req);
  await admin(req);
}

// A helper function to sanitize string fields
function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export async function PUT(req) {
  try {
    // 1) Run your authentication & business checks
    await middleware(req);

    // 2) Connect to your DB
    await db.connectDb();

    // 3) Parse and sanitize the request body
    const body = await req.json();

    const { _id, parent, name } = body;

    // Example: sanitize known string fields
    if (body.name) body.name = sanitizeString(body.name);
    if (body.description) body.description = sanitizeString(body.description);
    if (body.brand) body.brand = sanitizeString(body.brand);

    // If you have arrays of strings, e.g. subCategories, sanitize each:
    if (Array.isArray(body.subCategories)) {
      body.subCategories = body.subCategories.map(sanitizeString);
    } else {
      body.subCategories = [body.subCategories];
    }
    if (Array.isArray(body.subCategorie2)) {
      body.subCategorie2 = body.subCategorie2.map(sanitizeString);
    } else {
      body.subCategorie2 = [body.subCategorie2];
    }
    if (Array.isArray(body.subCategorie3)) {
      body.subCategorie3 = body.subCategorie3.map(sanitizeString);
    } else if (body.subCategorie3 === "") {
      body.subCategorie3 = [];
    } else {
      body.subCategorie3 = [body.subCategorie3];
    }

    // If you have an array of subProducts, also sanitize relevant fields:
    if (Array.isArray(body.subProducts)) {
      body.subProducts = body.subProducts.map((subP) => {
        // e.g., subP.color, subP.variant, subP.gender, etc.
        if (typeof subP.color === "string") {
          subP.color = sanitizeString(subP.color);
        }
        if (typeof subP.variant === "string") {
          subP.variant = sanitizeString(subP.variant);
        }
        if (typeof subP.gender === "string") {
          subP.gender = sanitizeString(subP.gender);
        }
        if (typeof subP.warranty === "string") {
          subP.warranty = sanitizeString(subP.warranty);
        }

        // You can sanitize more fields as needed
        return subP;
      });
    }

    // 4) Check if the product exists
    let product = await Product.findById(_id);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found." }), {
        status: 404,
      });
    }

    // 5) If the name changed, check for conflicts
    if (body.name && body.name !== product.name && !parent) {
      const existingProduct = await Product.findOne({ name: body.name });
      if (existingProduct) {
        return new Response(
          JSON.stringify({
            message:
              "Ya existe un producto con ese nombre, escoge otro nombre por favor.",
          }),
          { status: 400 }
        );
      }
    }

    // 6) If the name changed, recalc slug
    if (body.name && body.name !== product.name) {
      const slugOptions = {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@,]/g,
      };
      const generatedSlug = slugify(body.name, slugOptions);
      body.slug = generatedSlug;
    }

    // 7) Recalculate subProducts data
    //    e.g., volumetric weight, discount prices, etc.
    if (Array.isArray(body.subProducts)) {
      body.subProducts = body.subProducts.map((subP) => {
        if (
          subP?.measures?.long &&
          subP?.measures?.width &&
          subP?.measures?.high
        ) {
          const volumetricWeight = parseFloat(
            (subP.measures.long * subP.measures.width * subP.measures.high) /
              2220
          ).toFixed(1);
          subP.measures.volumetric_weight = volumetricWeight;
        }

        // Recalc each size's discount
        if (Array.isArray(subP.sizes)) {
          subP.sizes = subP.sizes.map((sz) => {
            let { price } = sz;

            let priceWithDiscount = price;
            if (subP.discount && subP.discount > 0) {
              priceWithDiscount = parseFloat(
                (price - (price * subP.discount) / 100).toFixed(2)
              );
            }

            let priceWithDiscountFlash = price;
            if (subP.flashDiscount && subP.flashDiscount > 0) {
              priceWithDiscountFlash = parseFloat(
                (price - (price * subP.flashDiscount) / 100).toFixed(2)
              );
            }

            return {
              ...sz,
              priceWithDiscount,
              priceWithDiscountFlash,
            };
          });
        }
        return subP;
      });
    }

    // 8) Distinguish between updating a parent product vs. a subProduct
    if (parent) {
      const parentProduct = await Product.findById(parent);
      if (!parentProduct) {
        return new Response(
          JSON.stringify({ message: "Parent product not found!" }),
          { status: 400 }
        );
      }
      // Example: Add a subProduct to the parent
      // If you want a different logic, adapt accordingly.
      await parentProduct.updateOne(
        {
          $push: {
            subProducts: {
              color: body.color,
              images: body.images,
              sizes: body.sizes,
              discount: body.discount,
              gender: body.gender,
              warranty: body.warranty,
              flashOffer: body.flashOffer,
              chargeMarket: body.chargeMarket,
              weight: body.weight,
              measures: body.measures,
              flashDiscount: body.flashDiscount,
              variant: body.variant,
            },
          },
        },
        { new: true }
      );

      await db.disconnectDb();
      return new Response(
        JSON.stringify({ message: "SubProduct added successfully." }),
        { status: 200 }
      );
    } else {
      // 9) Update the entire product
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { ...body },
        { new: true }
      );

      await db.disconnectDb();
      return new Response(
        JSON.stringify({
          message: "Producto actualizado con éxito",
          product: updatedProduct,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("ERROR in /api/admin/product/updateProduct =>", error);
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
