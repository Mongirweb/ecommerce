import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import auth from "../../../../middleware/auth";
import slugify from "slugify";
import sanitizeHtml from "sanitize-html";

async function middleware(req) {
  await auth(req);
}

function sanitizeString(str) {
  if (typeof str !== "string") return str; // keep numbers, booleans etc.
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export async function POST(req) {
  try {
    await db.connectDb();
    await middleware(req);

    // 1) Parse the incoming JSON
    const body = await req.json();

    // 2) Sanitize the relevant string fields
    //    (Adjust fields based on your use case)
    body.company = sanitizeString(body.company);
    body.name = sanitizeString(body.name);
    body.description = sanitizeString(body.description);
    body.brand = sanitizeString(body.brand);
    body.category = sanitizeString(body.category);
    // subCategories, subCategorie2, subCategorie3 might be arrays or strings
    // For example, if subCategories is an array of strings:
    if (Array.isArray(body.subCategories)) {
      body.subCategories = body.subCategories.map(sanitizeString);
    }
    if (body.subCategorie2) {
      body.subCategorie2 = sanitizeString(body.subCategorie2);
    }
    if (body.subCategorie3) {
      body.subCategorie3 = sanitizeString(body.subCategorie3);
    }

    // If color is a string or an object with name, hex, etc., sanitize accordingly
    if (typeof body.color === "string") {
      body.color = sanitizeString(body.color);
    } else if (body.color && typeof body.color.name === "string") {
      body.color.name = sanitizeString(body.color.name);
      // optionally sanitize hex or other fields in color
    }

    // If variant is a string, sanitize it; if it's an object, adjust accordingly
    if (typeof body.variant === "string") {
      body.variant = sanitizeString(body.variant);
    }

    // If images is an array of URLs, we typically don't sanitize them as HTML,
    // but you could do a check or basic regex if needed.

    // 3) Check if a product with the same name exists
    const existingProduct = await Product.findOne({ name: body.name });
    if (existingProduct && !body.parent) {
      return new Response(
        JSON.stringify({
          message:
            "No se puede crear el producto ya que existe uno con el mismo nombre. Escoge otro nombre.",
        }),
        { status: 400 }
      );
    }

    // 4) Calculate volumetric weight
    const volumetricWeight = parseFloat(
      (body.measures.long * body.measures.width * body.measures.high) / 2220
    ).toFixed(1);

    // 5) Configure slugify options to remove special characters
    const slugOptions = {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@,]/g,
    };
    const generatedSlug = slugify(body.name, slugOptions);

    // 6) Helper functions to calculate discount prices
    const calculateDiscountedPrice = (price, discount) =>
      parseFloat((price - (price * discount) / 100).toFixed(2));

    // 7) Process sizes array
    body.sizes = body.sizes.map((size) => {
      const priceWithDiscount =
        body.discount && body.discount > 0
          ? calculateDiscountedPrice(size.price, body.discount)
          : size.price;

      const priceWithDiscountFlash =
        body.flashDiscount && body.flashDiscount > 0
          ? calculateDiscountedPrice(size.price, body.flashDiscount)
          : size.price;

      return {
        ...size,
        priceWithDiscount,
        priceWithDiscountFlash,
      };
    });

    if (body.parent) {
      // 8) If adding a subProduct to a parent
      const parent = await Product.findById(body.parent);
      if (!parent) {
        return new Response(
          JSON.stringify({ message: "Parent product not found!" }),
          { status: 400 }
        );
      }
      await parent.updateOne(
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
              measures: {
                long: body.measures.long,
                width: body.measures.width,
                high: body.measures.high,
                volumetric_weight: volumetricWeight,
              },
              flashDiscount: body.flashDiscount,
              variant: body.variant,
            },
          },
        },
        { new: true }
      );

      await db.disconnectDb();
      return new Response(
        JSON.stringify({ message: "Product updated successfully." }),
        { status: 200 }
      );
    } else {
      // 9) Create a new product
      const newProduct = new Product({
        company: body.company,
        name: body.name,
        description: body.description,
        brand: body.brand,
        slug: generatedSlug,
        category: body.category,
        subCategories: body.subCategories,
        subCategorie2: body.subCategorie2 || null,
        subCategorie3: body.subCategorie3 || null,
        subProducts: [
          {
            color: body.color,
            images: body.images,
            sizes: body.sizes,
            discount: body.discount,
            gender: body.gender,
            warranty: body.warranty,
            flashOffer: body.flashOffer,
            chargeMarket: body.chargeMarket,
            weight: body.weight,
            measures: {
              long: body.measures.long,
              width: body.measures.width,
              high: body.measures.high,
              volumetric_weight: volumetricWeight,
            },
            flashDiscount: body.flashDiscount,
            variant: body.variant,
          },
        ],
      });

      await newProduct.save();
      await db.disconnectDb();
      return new Response(
        JSON.stringify({ message: "Product created successfully." }),
        { status: 200 }
      );
    }
  } catch (error) {
    // In case of an error, ensure DB is disconnected
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
