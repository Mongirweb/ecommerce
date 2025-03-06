import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/business";
import slugify from "slugify";

// Middleware function to handle authentication and business check
async function middleware(req) {
  await auth(req);
  await admin(req);
}

export async function POST(req) {
  try {
    await db.connectDb();
    await middleware(req);

    const body = await req.json();

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name: body.name });
    if (existingProduct && !body.parent) {
      return new Response(
        JSON.stringify({
          message:
            "No se puede crear el producto ya que existe uno con el mismo nombre, escoge otro nombre",
        }),
        { status: 400 }
      );
    }

    // Calculate volumetric weight
    const volumetricWeight =
      (body.measures.long * body.measures.width * body.measures.high) / 2220;

    // Configure slugify options to remove special characters
    const slugOptions = {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters except hyphens
      remove: /[*+~.()'"!:@,]/g, // Remove specific special characters
    };

    const generatedSlug = slugify(body.name, slugOptions);

    // Functions to calculate priceWithDiscount and priceWithDiscountFlash
    const calculateDiscountedPrice = (price, discount) => {
      return parseFloat((price - (price * discount) / 100).toFixed(2));
    };

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
      const parent = await Product.findById(body.parent);
      if (!parent) {
        return new Response(
          JSON.stringify({ message: "Parent product not found!" }),
          { status: 400 }
        );
      } else {
        await parent.updateOne(
          {
            $push: {
              subProducts: {
                sku: body.sku,
                color: body.color,
                images: body.images,
                sizes: body.sizes, // Sizes now include the computed prices
                discount: body.discount,
                universalCode: body.universalCode,
                gender: body.gender,
                warranty: body.warranty,
                flashOffer: body.flashOffer,
                chargeMarket: body.chargeMarket,
                measures: {
                  long: body.measures.long,
                  width: body.measures.width,
                  high: body.measures.high,
                  volumetric_weight: volumetricWeight,
                },
                flashDiscount: body.flashDiscount,
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
      }
    } else {
      const newProduct = new Product({
        company: body.company,
        name: body.name,
        description: body.description,
        brand: body.brand,
        slug: generatedSlug, // Use the configured slug
        category: body.category,
        subCategories: body.subCategories,
        subCategorie2: body.subCategorie2 || null,
        subCategorie3: body.subCategorie3 || null,
        subProducts: [
          {
            sku: body.sku,
            color: body.color,
            images: body.images,
            sizes: body.sizes, // Sizes now include the computed prices
            discount: body.discount,
            universalCode: body.universalCode,
            gender: body.gender,
            warranty: body.warranty,
            flashOffer: body.flashOffer,
            chargeMarket: body.chargeMarket,
            measures: {
              long: body.measures.long,
              width: body.measures.width,
              high: body.measures.high,
              volumetric_weight: volumetricWeight,
            },
            flashDiscount: body.flashDiscount,
          },
        ],
      });
      await newProduct.save();
      await db.disconnectDb();
      return new Response(
        JSON.stringify({ message: "Product created successfully." }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
