// app/api/import-from-excel/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import slugify from "slugify";
import { remove as removeDiacritics } from "diacritics";

/* helpers */
const capEach = (s = "") =>
  s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

async function uniqueSlug(base) {
  let c = base,
    i = 1;
  while (await Product.exists({ slug: c })) c = `${base}-${i++}`;
  return c;
}

const norm = (s = "") =>
  removeDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/* clave de variante */
function keyVar(img = "", color = "", parentImg = "") {
  const colorKey = color ? color.trim().toLowerCase() : "";
  if (!colorKey) return "default"; // ⇒ sólo tallas
  const imgKey = !img || img === parentImg ? "" : img.trim().toLowerCase();
  return `${imgKey}|${colorKey}`;
}

/* endpoint */
export async function POST(req) {
  try {
    await db.connectDb();
    const rows = await req.json();
    if (!Array.isArray(rows) || !rows.length)
      throw new Error("Request body must be a non‑empty array");

    /* mapear tags → IDs */
    const catTags = [...new Set(rows.map((r) => r.tag1).filter(Boolean))];
    const subTags = [...new Set(rows.map((r) => r.tag0).filter(Boolean))];

    const [cats, subs] = await Promise.all([
      Category.find({ name: { $in: catTags } }).lean(),
      SubCategory.find({ name: { $in: subTags } }).lean(),
    ]);

    const catMap = Object.fromEntries(cats.map((c) => [norm(c.name), c._id]));
    const subMap = Object.fromEntries(subs.map((s) => [norm(s.name), s._id]));

    /* agrupar por padre */
    const grouped = {};
    for (const r of rows) {
      const key = r.parentSku || r.sku;
      if (!grouped[key]) {
        grouped[key] = {
          sku: key,
          name: capEach(r.name),
          description: r.description || "",
          price: r.price,
          image: r.image,
          variants: new Map(), // keyVar → {images:Set,color,sizes[]}
          categoryId: catMap[norm(r.tag1)] || null,
          subCategoryId: subMap[norm(r.tag0)] || null,
          Alto: r.Alto,
          Ancho: r.Ancho,
          Largo: r.Largo,
          weight: r.weight,
        };
      }

      if (r.parentSku) {
        const k = keyVar(r.image, r.color, grouped[key].image);
        if (!grouped[key].variants.has(k)) {
          grouped[key].variants.set(k, {
            images: new Set(),
            color: r.color,
            sizes: [],
          });
        }
        const v = grouped[key].variants.get(k);
        if (k !== "default" && r.image) v.images.add(r.image); // ← solo si no es default
        v.sizes.push({
          size: r.size,
          sku: r.sku || grouped[key].sku,
          price: r.price || grouped[key].price,
        });
      }
    }

    /* insertar / actualizar */
    const companyId = "67b6850eb14a2d3a0b58e220";
    const slugOpts = { lower: true, strict: true, remove: /[*+~.()'"!:@,]/g };
    let imported = 0;

    for (const p of Object.values(grouped)) {
      const slug = await uniqueSlug(slugify(p.name || p.sku, slugOpts));

      const subProducts = [];
      const variantsArr = Array.from(p.variants.entries()); // [key, value]

      if (variantsArr.length === 0) {
        /* sin variantes */
        subProducts.push({
          images: p.image ? [{ url: p.image, public_id: "" }] : [],
          sku: p.sku,
          price: Number(p.price) || 0,
          idShopify: "",
          description_images: [],
          gender: "Sin género",
          warranty: { number: 1 },
          weight: p.weight,
          flashOffer: "No",
          chargeMarket: 0,
          measures: {
            long: p.Largo,
            width: p.Ancho,
            high: p.Alto,
            volumetric_weight: "",
          },
          color: { color: "#ADD8E6", image: p.image },
          sizes: [
            {
              qty: 50,
              wholesalePrice: 0,
              price: Number(p.price) || 0,
              sku: p.sku,
              size: p.size,
              universalCode: p.sku,
              priceWithDiscount: 0,
              priceWithDiscountFlash: 0,
            },
          ],
          discount: 0,
          variant: "Única",
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        });
      } else {
        variantsArr.forEach(([k, v], idx) => {
          const [firstSize] = v.sizes;
          const variantImgs = Array.from(v.images);

          const images =
            k === "default"
              ? p.image
                ? [{ url: p.image, public_id: "" }]
                : []
              : idx === 0
              ? [
                  ...(p.image ? [{ url: p.image, public_id: "" }] : []),
                  ...variantImgs.map((u) => ({ url: u, public_id: "" })),
                ]
              : variantImgs.map((u) => ({ url: u, public_id: "" }));

          subProducts.push({
            images,
            sku: firstSize.sku,
            price: Number(firstSize.price) || 0,
            idShopify: "",
            description_images: [],
            gender: "Sin género",
            warranty: { number: 1 },
            weight: p.weight,
            flashOffer: "No",
            chargeMarket: 0,
            measures: {
              long: p.Largo,
              width: p.Ancho,
              high: p.Alto,
              volumetric_weight: "",
            },
            color: {
              color: v.color || "#ADD8E6",
              image: variantImgs[0] || p.image,
            },
            sizes: v.sizes.map((s) => ({
              qty: 50,
              wholesalePrice: 0,
              price: Number(s.price) || 0,
              sku: s.sku,
              size: s.size,
              universalCode: s.sku,
              priceWithDiscount: 0,
              priceWithDiscountFlash: 0,
            })),
            discount: 0,
            variant: capEach(v.color) || "Única",
            flashDiscount: 0,
            sold: 0,
            soldInFlash: 0,
            totalSold: 0,
          });
        });
      }

      await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name: p.name,
          description: p.description,
          brand: "",
          slug,
          category: p.categoryId ?? undefined,
          subCategories: p.subCategoryId ? [{ _id: p.subCategoryId }] : [],
          fromShopify: false,
          subProducts,
          mainImage: p.image,
          basePrice: Number(p.price) || 0,
        },
        { upsert: true, new: true, overwrite: true }
      );
      imported++;
    }

    await db.disconnectDb();
    return NextResponse.json({ success: true, imported });
  } catch (err) {
    console.error(err);
    await db.disconnectDb();
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
