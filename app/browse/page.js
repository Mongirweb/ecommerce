// app/browse/page.js
import React from "react";
import db from "../../utils/db";
import Product from "../../models/Product";
import SubCategory from "../../models/SubCategory";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../../utils/arrays_utils";
import dynamic from "next/dynamic";
import { categories } from "../../data/categorie";
import locations from "../../data/locations.json";
import axios from "axios";
import { customMetaDataGenerator } from "../components/customMetaDataGenerator";
import SubCategory2 from "../../models/SubCategory2";
import SubCategory3 from "../../models/SubCategory3";
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
    ? `Buscar "${searchQuery}" en Somos el Hueco Medellín`
    : categoryObj
    ? `${categoryObj.name} - Saldos y Ofertas en Somos el Hueco Medellín`
    : "Explora las Categorías - Somos el Hueco Medellín";

  const description = searchQuery
    ? `Explora productos relacionados con "${searchQuery}" en Somos el Hueco Medellín. Ofrecemos increíbles saldos y ofertas en moda, electrónicos, hogar y más. Pago en línea rápido y seguro.`
    : categoryObj
    ? `Descubre increíbles saldos y ofertas en ${categoryObj.name} en Somos el Hueco Medellín. Encuentra productos de alta calidad a precios bajos con envío rápido y seguro.`
    : "Explora las mejores ofertas en moda, electrónicos, hogar y más en Somos el Hueco Medellín. Ofrecemos productos de alta calidad con pagos seguros.";

  const imageUrl = categoryObj?.image;

  const keywords = [
    categoryObj?.name || "",
    searchQuery || "",
    "Somos el Hueco Medellín",
    "El Hueco de Medellín",
    "somoselhueco",
    "somos el hueco",
    "el hueco medellín",
    "el hueco Colombia",
    "comprar en el hueco somos el hueco",
    "somoselhueco",
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
    ? `https://www.somoselhueco.com/browse?search=${searchQuery}`
    : categoryObj
    ? `https://www.somoselhueco.com/browse?category=${categoryObj.id}`
    : "https://www.somoselhueco.com/browse";

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

  const categoryQuery = query.category || "";
  const genderQuery = query.gender || "";
  const priceQuery = query.price?.split("_") || "";
  const subCategoryQuery = query.subcategory || "";
  const subCategory2Query = query.subcategory2 || "";
  const subCategory3Query = query.subcategory3 || "";
  const shippingQuery = query.shipping || 0;
  const ratingQuery = query.rating || "";
  const sortQuery = query.sort || "";
  const pageSize = 50;
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
    priceQuery && priceQuery[0]
      ? {
          "subProducts.sizes": {
            $elemMatch: {
              $or: [
                {
                  priceWithDiscount: {
                    $gte: Number(priceQuery[0]) || 0,
                    $lte: Number(priceQuery[1]) || Infinity,
                  },
                },
                {
                  $and: [
                    { priceWithDiscount: { $exists: false } },
                    {
                      price: {
                        $gte: Number(priceQuery[0]) || 0,
                        $lte: Number(priceQuery[1]) || Infinity,
                      },
                    },
                  ],
                },
              ],
            },
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

  const sort =
    sortQuery === ""
      ? {}
      : sortQuery === "popular"
      ? { rating: -1, "subProducts.sold": -1 }
      : sortQuery === "newest"
      ? { createdAt: -1 }
      : sortQuery === "topSelling"
      ? { "subProducts.sold": -1 }
      : sortQuery === "topReviewed"
      ? { rating: -1 }
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
    // Use Atlas Search for fuzzy search without category/subcategory filters
    const pipeline = [
      {
        $search: {
          index: "Search_Index_Editor", // Your Atlas Search index name
          text: {
            query: searchQuery,
            path: "name",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $match: {
          // Apply all filters except category, subCategory, subCategory2, subCategory3
          ...brand,
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
          // No category/subcategory filters here
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

      { $sort: Object.keys(sort).length ? sort : { _id: 1 } },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize },
    ];

    const productsDb = await Product.aggregate(pipeline).allowDiskUse(true);
    products =
      sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);

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
          ...shipping,
          ...rating,
          ...discountFilter,
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
      ...shipping,
      ...rating,
      ...discountFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(sort)
      .lean();

    products =
      sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);

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
      ...shipping,
      ...rating,
      ...discountFilter,
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
          ...pattern,
          ...material,
          ...gender,
          ...price,
          ...shipping,
          ...rating,
          ...discountFilter,
        }),
  }).distinct("details");

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
      />
    </div>
  );
}
