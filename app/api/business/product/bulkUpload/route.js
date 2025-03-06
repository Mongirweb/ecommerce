import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import auth from "../../../../../middleware/auth";
import slugify from "slugify";

// Middleware function to handle authentication
async function middleware(req) {
  await auth(req);
}

// Helper function to process images
function processImages(images) {
  return images.map((imageUrl) => {
    // Regular expression to extract public_id
    const matches = imageUrl.match(/upload\/(?:v\d+\/)?([^\.]+)\.\w+$/);
    if (matches && matches[1]) {
      const public_id = matches[1];
      // Decode URI components in case of spaces or special characters
      const decoded_public_id = decodeURIComponent(public_id);
      return { url: imageUrl, public_id: decoded_public_id };
    } else {
      // Handle cases where public_id can't be extracted
      console.warn(`Could not extract public_id from image URL: ${imageUrl}`);
      return { url: imageUrl, public_id: null };
    }
  });
}

export async function POST(req) {
  try {
    await db.connectDb();
    await middleware(req);

    const body = await req.json();

    // Ensure that 'body' is an array of products
    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({
          message: "Invalid data format. Expected an array of products.",
        }),
        { status: 400 }
      );
    }

    // Group products by SKU and name
    const productsBySku = {};
    body.forEach((product) => {
      const key = `${product.sku}_${product.name}`;
      if (!productsBySku[key]) {
        productsBySku[key] = [];
      }
      productsBySku[key].push(product);
    });

    for (const key in productsBySku) {
      const productsGroup = productsBySku[key];
      const firstProduct = productsGroup[0];
      const { sku, name } = firstProduct;

      // Generate slug using slugify
      const slugOptions = {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@,]/g,
      };
      const generatedSlug = slugify(name, slugOptions);

      // Calculate volumetric weight for measures
      const calculateVolumetricWeight = (measures) => {
        return (
          (measures.long * measures.width * measures.high) /
          2220
        ).toFixed(2);
      };

      // Functions to calculate priceWithDiscount and priceWithDiscountFlash
      const calculateDiscountedPrice = (price, discount) => {
        return parseFloat((price - (price * discount) / 100).toFixed(2));
      };

      // Prepare subProducts array
      const subProducts = productsGroup.map((product) => {
        const volumetricWeight = calculateVolumetricWeight(product.measures);

        // Process sizes
        const sizes = product.sizes.map((size) => {
          const priceWithDiscount =
            product.discount && product.discount > 0
              ? calculateDiscountedPrice(size.price, product.discount)
              : size.price;

          const priceWithDiscountFlash =
            product.flashDiscount && product.flashDiscount > 0
              ? calculateDiscountedPrice(size.price, product.flashDiscount)
              : size.price;

          return {
            ...size,
            priceWithDiscount,
            priceWithDiscountFlash,
          };
        });

        // Process images to include public_id
        const images = processImages(product.images);

        // If product.color.image is not set, set it to the first image's URL
        if (!product.color || !product.color.image) {
          if (images.length > 0) {
            if (!product.color) {
              product.color = {};
            }
            product.color.image = images[0].url;
          }
        }

        return {
          sku: product.sku,
          color: product.color,
          images, // Updated to include processed images
          sizes,
          discount: product.discount,
          universalCode: product.universalCode,
          gender: product.gender,
          warranty: product.warranty,
          flashOffer: product.flashOffer,
          chargeMarket: product.chargeMarket,
          measures: {
            long: product.measures.long,
            width: product.measures.width,
            high: product.measures.high,
            volumetric_weight: volumetricWeight,
          },
          flashDiscount: product.flashDiscount,
        };
      });

      // Check if a product with the same SKU and name already exists
      const existingProduct = await Product.findOne({ sku, name });

      if (existingProduct) {
        // Update existing product by adding new subProducts
        await existingProduct.updateOne(
          {
            $push: {
              subProducts: { $each: subProducts },
            },
          },
          { new: true }
        );
      } else {
        // Create a new product
        const newProduct = new Product({
          company: firstProduct.company,
          name: firstProduct.name,
          description: firstProduct.description,
          brand: firstProduct.brand,
          slug: generatedSlug,
          category: firstProduct.category,
          subCategories: firstProduct.subCategories,
          subCategorie2: firstProduct.subCategorie2, // Subcategory Level 2 ID
          subCategorie3: firstProduct.subCategorie3,
          subProducts,
        });
        await newProduct.save();
      }
    }

    await db.disconnectDb();
    return new Response(
      JSON.stringify({ message: "Products uploaded successfully." }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
