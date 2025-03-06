import Product from "../../../../models/Product";
import User from "../../../../models/User";
import db from "../../../../utils/db";

export async function GET(req) {
  try {
    // Parse the URL to get the pathname and search parameters
    const { searchParams, pathname } = new URL(req.url);

    // Extract the product ID from the pathname
    const id = pathname.split("/").pop(); // This will give you '66ba58f7cc276036c17ce6ca'

    // Extract style and size from query parameters
    const style = searchParams.get("style") || 0;
    const size = searchParams.get("size") || 0;

    // Connect to the database
    await db.connectDb();

    // Find the product by its ID
    const product = await Product.findById(id).lean();

    // Calculate the discount and final price
    let discount = product.subProducts[style].discount;
    let wholesalePrice = product.subProducts[style].sizes[size].wholesalePrice;
    let priceBefore = product.subProducts[style].sizes[size].price;
    const price = discount
      ? priceBefore - (priceBefore * discount) / 100
      : priceBefore;

    // Optionally retrieve the company/user info
    const companyId = product.company;
    const company = companyId ? await User.findById(companyId).lean() : null;
    const companyName = company ? company.name : null;

    // Disconnect from the database
    await db.disconnectDb();

    // Return the response as a JSON object
    return new Response(
      JSON.stringify({
        _id: product._id,
        style: Number(style),
        name: product.name,
        description: product.description,
        slug: product.slug,
        sku: product.subProducts[style].sizes[size].sku,
        brand: product.brand,
        company: product.company,
        companyName,
        category: product.category,
        subCategories: product.subCategories,
        subCategorie2: product.subCategorie2,
        subCategorie3: product.subCategorie3,
        shipping: product.shipping,
        images: product.subProducts[style].images,
        color: product.subProducts[style].color,
        size: product.subProducts[style].sizes[size].size,
        variant: product.subProducts[style].variant,
        idShopify: product.subProducts[style].idShopify || "",
        fromShopify: product.fromShopify,
        price,
        wholesalePrice,
        priceBefore,
        quantity: product?.subProducts[style].sizes[size].qty,
        measures: product?.subProducts[style].measures,
        warranty: product?.subProducts[style].warranty,
        gender: product?.subProducts[style].gender,
        discount: product?.subProducts[style].discount,
        flashOffer: product?.subProducts[style].flashOffer,
        flashDiscount: product?.subProducts[style].flashDiscount,
        weight: product?.subProducts[style].weight,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
