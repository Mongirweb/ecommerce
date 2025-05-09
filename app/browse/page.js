// app/browse/page.js
import React from "react";
import db from "../../utils/db";
import Product from "../../models/Product";
import User from "../../models/User";
import SubCategory from "../../models/SubCategory";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../../utils/arrays_utils";
import dynamic from "next/dynamic";
import { categories } from "../../data/categorie";
import locations from "../../data/locations.json";
import { customMetaDataGenerator } from "../components/customMetaDataGenerator";
import SubCategory2 from "../../models/SubCategory2";
import SubCategory3 from "../../models/SubCategory3";
import mongoose from "mongoose";
import styles from "../../styles/browse.module.scss";

const Header = dynamic(() => import("../../components/header"), {
  suspense: true,
});

const BrowseClient = dynamic(() => import("./BrowseClient"), {
  ssr: false,
});

export async function generateMetadata({ searchParams }) {
  const query = searchParams;
  const categoryQuery = query.category || "";
  // Find the category object based on the query
  const categoryObj = categories.find(
    (c) => c.slug === categoryQuery || c.id === categoryQuery
  );
  const searchQuery = query.search || "";

  await db.connectDb();

  const title = searchQuery
    ? `Buscar "${searchQuery}" en Mongir`
    : categoryObj
    ? `${categoryObj.name} - Lo Mejor para tu bebe en Mongir`
    : "Explora las Categorías - Mongir";

  const description = searchQuery
    ? `Explora productos relacionados con "${searchQuery}" en Mongir. Ofrecemos increíbles saldos y ofertas en moda, electrónicos, hogar y más. Pago en línea rápido y seguro.`
    : categoryObj
    ? `Descubre increíbles saldos y ofertas en ${categoryObj.name} en Mongir. Encuentra productos de alta calidad a precios bajos con envío rápido y seguro.`
    : "Explora las mejores ofertas en moda, electrónicos, hogar y más en Mongir. Ofrecemos productos de alta calidad con pagos seguros.";

  const imageUrl = categoryObj?.image;

  const keywords = [
    categoryObj?.name || "",
    searchQuery || "",
    "Mongir",
    "Mongir Medellín",
    "mongir",
    "mongir medellin",
    "mongir Colombia",
    "comprar en el hueco bebe el hueco",
    "mongir",
    "el hueco virtual",
    "centro comercial el hueco",
    "compras en línea el hueco",
    "compra online el hueco",
    "tienda en línea el hueco",
    "compra al por mayor en el hueco",
    "mayoristas en el hueco",
    "tiendas en el hueco medellín",
    "productos en el hueco medellín",
    "mapa el hueco medellin",
    "como comprar en el hueco",
    "descuentos en el hueco",
    "ofertas el hueco",
    "promociones el hueco",
  ].filter((keyword) => typeof keyword === "string" && keyword.trim() !== ""); // Ensure only non-empty strings are included

  const canonicalUrl = searchQuery
    ? `https://www.mongir.com/browse?search=${searchQuery}`
    : categoryObj
    ? `https://www.mongir.com/browse?category=${categoryObj.id}`
    : "https://www.mongir.com/browse";

  await db.disconnectDb();

  return customMetaDataGenerator({
    title,
    description,
    ogImage: imageUrl,
    canonicalUrl,
    ogType: "website",
    keywords,
  });
}

export default async function Browse({ searchParams }) {
  // Extract query parameters from searchParams
  const query = searchParams;

  //-------------------------------------------------->
  const searchQuery = query.search || "";

  const companyQuery = query.company || "";

  const categoryQuery = query.category || "";
  const genderQuery = query.gender || "";
  const priceQuery = query.price?.split("_") || [];

  const subCategoryQuery = query.subcategory || "";
  const subCategory2Query = query.subcategory2 || "";
  const subCategory3Query = query.subcategory3 || "";
  const shippingQuery = query.shipping || 0;
  const ratingQuery = query.rating || "";
  const sortQuery = query.sort || "";
  const pageSize = 20;
  const page = query.page || 1;
  const discountQuery = query.discount?.split("_") || [];
  const minDiscount = discountQuery[0] || 0;
  const maxDiscount = discountQuery[1] || 100;

  //-----------
  const brandQuery = query.brand?.split("_") || [];
  const styleQuery = query.style?.split("_") || [];
  const patternQuery = query.pattern?.split("_") || [];
  const materialQuery = query.material?.split("_") || [];
  const sizeQuery = query.size?.split("_") || [];
  const colorQuery = query.color?.split("_") || [];

  function createRegex(data, baseRegex) {
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        baseRegex += `|^${data[i]}`;
      }
    }
    return baseRegex;
  }

  const brandRegex = brandQuery[0]
    ? createRegex(brandQuery, `^${brandQuery[0]}`)
    : "";
  const styleRegex = styleQuery[0]
    ? createRegex(styleQuery, `^${styleQuery[0]}`)
    : "";
  const patternRegex = patternQuery[0]
    ? createRegex(patternQuery, `^${patternQuery[0]}`)
    : "";
  const materialRegex = materialQuery[0]
    ? createRegex(materialQuery, `^${materialQuery[0]}`)
    : "";
  const sizeRegexVal = sizeQuery[0]
    ? createRegex(sizeQuery, `^${sizeQuery[0]}`)
    : "";
  const colorRegexVal = colorQuery[0]
    ? createRegex(colorQuery, `^${colorQuery[0]}`)
    : "";

  //-------------------------------------------------->
  // Build $match conditions

  // Category filters
  const category =
    categoryQuery && categoryQuery !== "" ? { category: categoryQuery } : {};

  const subCategory =
    subCategoryQuery && subCategoryQuery !== ""
      ? { subCategories: { $in: [subCategoryQuery] } }
      : {};

  const subCategory2 =
    subCategory2Query && subCategory2Query !== ""
      ? { subCategorie2: { $in: [subCategory2Query] } }
      : {};

  const subCategory3 =
    subCategory3Query && subCategory3Query !== ""
      ? { subCategorie3: { $in: [subCategory3Query] } }
      : {};

  const style = styleQuery[0]
    ? {
        "details.value": { $regex: styleRegex, $options: "i" },
      }
    : {};

  const size = sizeQuery[0]
    ? {
        "subProducts.sizes.size": {
          $regex: sizeRegexVal,
          $options: "i",
        },
      }
    : {};

  const color = colorQuery[0]
    ? {
        "subProducts.color.color": {
          $regex: colorRegexVal,
          $options: "i",
        },
      }
    : {};

  const brand = brandQuery[0]
    ? {
        brand: { $regex: brandRegex, $options: "i" },
      }
    : {};

  const pattern = patternQuery[0]
    ? {
        "details.value": {
          $regex: patternRegex,
          $options: "i",
        },
      }
    : {};

  const material = materialQuery[0]
    ? {
        "details.value": {
          $regex: materialRegex,
          $options: "i",
        },
      }
    : {};

  const gender =
    genderQuery && genderQuery !== ""
      ? {
          "details.value": { $regex: genderQuery, $options: "i" },
        }
      : {};

  const price =
    priceQuery && priceQuery !== ""
      ? {
          "subProducts.sizes.price": {
            $gte: Number(priceQuery[0]) || 0,
            $lte: Number(priceQuery[1]) || Infinity,
          },
        }
      : {};

  const discountFilter =
    minDiscount && maxDiscount
      ? {
          "subProducts.discount": {
            $gte: Number(minDiscount),
            $lte: Number(maxDiscount),
          },
        }
      : {};

  const shipping = shippingQuery && shippingQuery == "0" ? { shipping: 0 } : {};

  const rating =
    ratingQuery && ratingQuery !== ""
      ? { rating: { $gte: Number(ratingQuery) } }
      : {};

  const company =
    companyQuery && companyQuery.trim() !== ""
      ? { company: new mongoose.Types.ObjectId(companyQuery.trim()) }
      : {};

  let defaultSort = {};

  if (searchQuery && searchQuery.trim() !== "") {
    // If user is performing a text search, default to sort by "score" descending
    defaultSort = { score: -1 };
  } else {
    // Otherwise, default to createdAt descending
    defaultSort = { createdAt: 1 };
  }

  const sort =
    sortQuery === ""
      ? defaultSort
      : sortQuery === "popular"
      ? { rating: -1, "subProducts.sold": -1 }
      : sortQuery === "newest"
      ? { createdAt: -1 }
      : sortQuery === "topSelling"
      ? { "subProducts.sold": -1 }
      : sortQuery === "topReviewed"
      ? { createdAt: -1 }
      : sortQuery === "priceHighToLow"
      ? {
          "subProducts.sizes.priceWithDiscount": -1,
          "subProducts.sizes.price": -1,
        }
      : sortQuery === "priceLowToHigh"
      ? {
          "subProducts.sizes.priceWithDiscount": 1,
          "subProducts.sizes.price": 1,
        }
      : {};

  await db.connectDb();

  let subCategories = [];
  let subCategorie2 = [];
  let subCategorie3 = [];

  if (categoryQuery) {
    subCategories = await SubCategory.find({ parent: categoryQuery }).lean();
  }

  if (categoryQuery && subCategoryQuery) {
    subCategorie2 = await SubCategory2.find({
      parent: subCategoryQuery,
    }).lean();
  }

  if (categoryQuery && subCategoryQuery && subCategory2Query) {
    subCategorie3 = await SubCategory3.find({
      parent: subCategory2Query,
    }).lean();
  }

  const categoryObj = categories.find(
    (c) => c.slug === categoryQuery || c.id === categoryQuery
  );

  // If there's a search query, we use fuzzy search. Otherwise, normal filtering.
  let products = [];
  let totalProducts = 0;

  if (searchQuery) {
    const queryTokens = searchQuery.split(" ");

    // Use Atlas Search for fuzzy search without category/subcategory filters
    const pipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              // 1) Exact phrase boost
              {
                phrase: {
                  query: searchQuery, // "set manicura pequeño"
                  path: ["name"], // add "slug" and "description"
                  slop: 2, // how many words can appear in-between
                  score: { boost: { value: 10 } }, // high boost for exact phrase
                },
              },
              // 2) Fuzzy text search (fallback)
              {
                text: {
                  query: searchQuery,
                  path: ["name"], // again, include "slug" etc.
                  fuzzy: {
                    maxEdits: 1, // allow slight typos
                    prefixLength: 1,
                  },
                  score: { boost: { value: 2 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $match: {
          // Apply your other filters
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
          "subProducts.sizes": {
            $elemMatch: { qty: { $gt: 0 } },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Expose the Atlas Search score as "score"
        $set: { score: { $meta: "searchScore" } },
      },
      {
        // Sort by highest score first
        $sort: Object.keys(sort).length ? sort : { score: -1 },
      },
      {
        // Handle pagination
        $skip: pageSize * (page - 1),
      },
      {
        $limit: pageSize,
      },
    ];

    const productsDb = await Product.aggregate(pipeline).allowDiskUse(true);
    products = sortQuery && sortQuery !== "" ? productsDb : productsDb;

    const countPipeline = [
      {
        $search: {
          index: "Search_Index_Editor",
          text: {
            query: searchQuery,
            path: "name",
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      {
        $match: {
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
          "subProducts.sizes": {
            $elemMatch: { qty: { $gt: 0 } },
          },
          // Again, no category/subcategory filters here
        },
      },
      { $count: "totalCount" },
    ];

    const countResult = await Product.aggregate(countPipeline).allowDiskUse(
      true
    );
    totalProducts = countResult[0]?.totalCount || 0;
  } else {
    // No search query: just use normal filtering by category and other fields
    let productsDb = await Product.find({
      ...category,
      ...subCategory,
      ...subCategory2,
      ...subCategory3,
      ...brand,
      ...style,
      ...size,
      ...color,
      ...pattern,
      ...material,
      ...gender,
      ...price,
      ...company,
      ...shipping,
      ...rating,
      ...discountFilter,
      "subProducts.sizes": {
        $elemMatch: { qty: { $gt: 0 } },
      },
    })
      .populate({ path: "company", model: "User" })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(sort)
      .lean();

    products = sortQuery && sortQuery !== "" ? productsDb : productsDb;

    totalProducts = await Product.countDocuments({
      ...category,
      ...subCategory,
      ...subCategory2,
      ...subCategory3,
      ...brand,
      ...style,
      ...size,
      ...color,
      ...pattern,
      ...material,
      ...gender,
      ...price,
      ...company,
      ...shipping,
      ...rating,
      ...discountFilter,
      "subProducts.sizes": {
        $elemMatch: { qty: { $gt: 0 } },
      },
    });
  }

  let paginationCount = Math.ceil(totalProducts / pageSize);

  // Distinct fields
  // Distinct colors
  let colors = await Product.find({
    ...(searchQuery
      ? {
          name: { $regex: searchQuery, $options: "i" },
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
        }
      : {
          ...category,
          ...subCategory,
          ...subCategory2,
          ...subCategory3,
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
  }).distinct("subProducts.color.color");

  // Distinct brands
  let brandsDb = await Product.find({
    ...(searchQuery
      ? {
          name: { $regex: searchQuery, $options: "i" },
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
        }
      : {
          ...category,
          ...subCategory,
          ...subCategory2,
          ...subCategory3,
          ...brand,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...company,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
  }).distinct("brand");

  let sizes = await Product.find({
    ...(searchQuery
      ? {
          name: { $regex: searchQuery, $options: "i" },
          ...brand,
          ...style,
          ...size,
          ...color,
          ...company,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }
      : {
          ...category,
          ...subCategory,
          ...subCategory2,
          ...subCategory3,
          ...brand,
          ...style,
          ...size,
          ...color,
          ...company,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
  }).distinct("subProducts.sizes.size");

  let details = await Product.find({
    ...(searchQuery
      ? {
          name: { $regex: searchQuery, $options: "i" },
          ...brand,
          ...style,
          ...size,
          ...color,
          ...company,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }
      : {
          ...category,
          ...subCategory,
          ...subCategory2,
          ...subCategory3,
          ...brand,
          ...company,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
  }).distinct("details");

  // Distinct list of company ObjectIds from your filtered products
  let companyIds = await Product.find({
    ...(searchQuery
      ? {
          name: { $regex: searchQuery, $options: "i" },
          ...brand,
          ...style,
          ...size,
          ...color,
          ...company,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }
      : {
          ...category,
          ...subCategory,
          ...subCategory2,
          ...subCategory3,
          ...brand,
          ...company,
          ...style,
          ...size,
          ...color,
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
    "subProducts.sizes": { $elemMatch: { qty: { $gt: 0 } } },
  }).distinct("company");

  // Then fetch full user docs for those IDs
  let companies = [];
  if (companyIds.length > 0) {
    companies = await User.find({ _id: { $in: companyIds } }).lean();
  }

  let stylesDb = filterArray(details, "Style");
  let patternsDb = filterArray(details, "Pattern Type");
  let materialsDb = filterArray(details, "Material");

  let styles = removeDuplicates(stylesDb);
  let patterns = removeDuplicates(patternsDb);
  let materials = removeDuplicates(materialsDb);
  let brands = removeDuplicates(brandsDb);

  await db.disconnectDb();

  // Render the page
  return (
    <div className={styles.browse}>
      <Header />
      <BrowseClient
        products={JSON.parse(JSON.stringify(products))}
        subCategories={JSON.parse(JSON.stringify(subCategories))}
        subCategorie2={JSON.parse(JSON.stringify(subCategorie2))}
        subCategorie3={JSON.parse(JSON.stringify(subCategorie3))}
        sizes={JSON.parse(JSON.stringify(sizes))}
        colors={JSON.parse(JSON.stringify(colors))}
        brands={JSON.parse(JSON.stringify(brands))}
        stylesData={JSON.parse(JSON.stringify(styles))}
        patterns={JSON.parse(JSON.stringify(patterns))}
        materials={JSON.parse(JSON.stringify(materials))}
        paginationCount={paginationCount}
        country={{
          name: "Morocco",
          flag: "https://cdn-icons-png.flaticon.com/512/197/197551.png?w=360",
        }}
        categories={categories}
        locations={locations}
        companies={JSON.parse(JSON.stringify(companies))}
      />
    </div>
  );
}
