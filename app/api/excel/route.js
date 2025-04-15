// app/api/import-from-excel/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import slugify from "slugify";
import { remove as removeDiacritics } from "diacritics";

/* ─── helpers de texto ─── */
const normalize = (s = "") =>
  removeDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

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

/* busca el _id con coincidencia parcial */
function findClosestId(tag, list) {
  const tagNorm = normalize(tag);
  for (const { normName, _id } of list) {
    if (tagNorm === normName) return _id; // exacto
  }
  for (const { normName, _id } of list) {
    if (tagNorm.includes(normName) || normName.includes(tagNorm)) return _id; // parcial
  }
  return null;
}

/* clave de variante */
function keyVar(img = "", color = "", parentImg = "") {
  const colorKey = color ? normalize(color) : "";
  if (!colorKey) return "default"; // solo tallas
  const imgKey = !img || img === parentImg ? "" : img.trim().toLowerCase();
  return `${imgKey}|${colorKey}`;
}

/* ─── endpoint ─── */
export async function POST(req) {
  try {
    await db.connectDb();
    const rows = await req.json();
    if (!Array.isArray(rows) || !rows.length)
      throw new Error("Request body must be a non‑empty array");

    /* 1) Cargar TODAS las categorías y subcategorías */
    const [cats, subs] = await Promise.all([
      Category.find({}).lean(),
      SubCategory.find({}).lean(),
    ]);
    const catList = cats.map((c) => ({
      normName: normalize(c.name),
      _id: c._id,
    }));
    const subList = subs.map((s) => ({
      normName: normalize(s.name),
      _id: s._id,
    }));

    /* 2) Agrupar por producto padre */
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
          categoryId: findClosestId(r.tag0, catList),
          subCategoryId: findClosestId(r.tag1, subList),
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
        if (k !== "default" && r.image) v.images.add(r.image);
        v.sizes.push({
          size: r.size,
          sku: r.sku || grouped[key].sku,
          price: r.price || grouped[key].price,
        });
      }
    }

    /* 3) Insertar / actualizar */
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
