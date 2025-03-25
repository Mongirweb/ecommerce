import db from "../../utils/db";
import Category from "../../models/Category"; // Adjust based on your structure
import Product from "../../models/Product"; // Adjust for your Product model

const BASE_URL = "https://www.mongir.com";

function generateSiteMap(categories, products) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!--Static URLs-->
    <url>
      <loc>${BASE_URL}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>

     <!--Dynamic Product URLs-->
     ${products
       .map(({ slug, updatedAt }) => {
         return `
      <url>
        <loc>${BASE_URL}/product/${slug}?style=0&amp;size=0</loc>
        <lastmod>${new Date(updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `;
       })
       .join("")}

    <!--Dynamic Category URLs-->
    ${categories
      .map(({ _id, updatedAt }) => {
        return `
      <url>
        <loc>${BASE_URL}/browse?category=${_id}</loc>
        <lastmod>${new Date(updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      `;
      })
      .join("")}

      <url>
      <loc>${BASE_URL}/browse</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>

 
   
  </urlset>
  `;
}

export async function GET() {
  try {
    // Connect to the database
    await db.connectDb();

    // Fetch categories from the database
    const categories = await Category.find({}, { _id: 1, updatedAt: 1 }).lean();
    const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();

    // Generate sitemap XML
    const sitemap = generateSiteMap(categories, products);

    // Return XML response
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
