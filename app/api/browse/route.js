// app/api/browse/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import User from "../../../models/User";
import SubCategory from "../../../models/SubCategory";
import SubCategory2 from "../../../models/SubCategory2";
import SubCategory3 from "../../../models/SubCategory3";
import { categories } from "../../../data/categorie";

import {
  filterArray,
  randomize, // si lo sigues usando
  removeDuplicates,
} from "../../../utils/arrays_utils";
import mongoose from "mongoose";

/* -------- helper para crear regex OR -------- */
function createRegex(arr) {
  return arr.length ? arr.map((v) => `^${v}`).join("|") : "";
}

/* -------- endpoint GET -------- */
export async function GET(req) {
  const url = new URL(req.url);

  const q = Object.fromEntries(url.searchParams);

  /* ---------- leer parámetros ---------- */
  const {
    search = "",
    company = "",
    category = "",
    gender = "",
    price = "",
    discount = "",
    subcategory = "",
    subcategory2 = "",
    subcategory3 = "",
    shipping = "0",
    rating = "",
    sort = "",
    page = "1",
    brand = "",
    style = "",
    pattern = "",
    material = "",
    size = "",
    color = "",
  } = q;

  const pageSize = 20;
  const [minPrice = 0, maxPrice = Infinity] = price.split("_");
  const [minDiscount = 0, maxDiscount = 100] = discount.split("_");

  const brandArr = brand.split("_").filter(Boolean);
  const styleArr = style.split("_").filter(Boolean);
  const patternArr = pattern.split("_").filter(Boolean);
  const materialArr = material.split("_").filter(Boolean);
  const sizeArr = size.split("_").filter(Boolean);
  const colorArr = color.split("_").filter(Boolean);

  /* ---------- filtros base ---------- */
  const match = {
    ...(category && { category }),
    ...(subcategory && { subCategories: { $in: [subcategory] } }),
    ...(subcategory2 && { subCategorie2: { $in: [subcategory2] } }),
    ...(subcategory3 && { subCategorie3: { $in: [subcategory3] } }),
    ...(company && { company: new mongoose.Types.ObjectId(company) }),
    ...(gender && { "details.value": { $regex: gender, $options: "i" } }),
    ...(shipping === "0" && { shipping: 0 }),
    ...(rating && { rating: { $gte: Number(rating) } }),
    ...(price && {
      "subProducts.sizes.price": {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      },
    }),
    ...(discount && {
      "subProducts.discount": {
        $gte: Number(minDiscount),
        $lte: Number(maxDiscount),
      },
    }),
    "subProducts.sizes": { $elemMatch: { qty: { $gt: 0 } } },
  };

  /* regex-based filters */
  const addRegex = (field, arr) =>
    arr.length ? { [field]: { $regex: createRegex(arr), $options: "i" } } : {};

  Object.assign(
    match,
    addRegex("brand", brandArr),
    addRegex("details.value", styleArr),
    addRegex("details.value", patternArr),
    addRegex("details.value", materialArr),
    addRegex("subProducts.sizes.size", sizeArr),
    addRegex("subProducts.color.color", colorArr)
  );

  /* ---------- sort ---------- */
  const defaultSort = search ? { score: -1 } : { createdAt: 1 };
  const sortMap = {
    popular: { rating: -1, "subProducts.sold": -1 },
    newest: { createdAt: -1 },
    topSelling: { "subProducts.sold": -1 },
    topReviewed: { createdAt: -1 },
    priceHighToLow: {
      "subProducts.sizes.priceWithDiscount": -1,
      "subProducts.sizes.price": -1,
    },
    priceLowToHigh: {
      "subProducts.sizes.priceWithDiscount": 1,
      "subProducts.sizes.price": 1,
    },
  };
  const sortStage = sort ? sortMap[sort] || defaultSort : defaultSort;

  /* ---------- DB queries ---------- */
  await db.connectDb();

  let products = [];
  let totalProducts = 0;

  if (search) {
    const pipeline = [
      {
        $search: {
          index: "Search_Index_Editor",
          compound: {
            should: [
              {
                phrase: {
                  query: search,
                  path: ["name"],
                  slop: 2,
                  score: { boost: { value: 10 } },
                },
              },
              {
                text: {
                  query: search,
                  path: ["name"],
                  fuzzy: { maxEdits: 1 },
                  score: { boost: { value: 2 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $match: match },
      { $set: { score: { $meta: "searchScore" } } },
      { $sort: Object.keys(sortStage).length ? sortStage : { score: -1 } },
      { $skip: pageSize * (Number(page) - 1) },
      { $limit: pageSize },
      {
        $lookup: {
          from: "users",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
    ];

    products = await Product.aggregate(pipeline).allowDiskUse(true);

    totalProducts = await Product.aggregate([
      {
        $search: {
          index: "Search_Index_Editor",
          text: { query: search, path: "name", fuzzy: { maxEdits: 1 } },
        },
      },
      { $match: match },
      { $count: "total" },
    ]).then((r) => r[0]?.total || 0);
  } else {
    products = await Product.find(match)
      .populate({ path: "company", model: "User" })
      .sort(sortStage)
      .skip(pageSize * (Number(page) - 1))
      .limit(pageSize)
      .lean();

    totalProducts = await Product.countDocuments(match);
  }

  /* ---------- facetas ---------- */
  const [colors, brands, sizes, detailsList, companyIds] = await Promise.all([
    Product.find(match).distinct("subProducts.color.color"),
    Product.find(match).distinct("brand"),
    Product.find(match).distinct("subProducts.sizes.size"),
    Product.find(match).distinct("details"),
    Product.find(match).distinct("company"),
  ]);

  const companies = companyIds.length
    ? await User.find({ _id: { $in: companyIds } }).lean()
    : [];

  const styles = removeDuplicates(filterArray(detailsList, "Style"));
  const patterns = removeDuplicates(filterArray(detailsList, "Pattern Type"));
  const materials = removeDuplicates(filterArray(detailsList, "Material"));

  let subCategories = [];
  let subCategorie2 = [];
  let subCategorie3 = [];

  if (category)
    subCategories = await SubCategory.find({ parent: category }).lean();
  if (subcategory)
    subCategorie2 = await SubCategory2.find({ parent: subcategory }).lean();
  if (subcategory2)
    subCategorie3 = await SubCategory3.find({ parent: subcategory2 }).lean();

  await db.disconnectDb();

  /* ---------- response ---------- */
  return NextResponse.json(
    {
      products,
      subCategories,
      subCategorie2,
      subCategorie3,
      colors,
      brands: removeDuplicates(brands),
      styles,
      patterns,
      materials,
      paginationCount: Math.ceil(totalProducts / pageSize),
      companies,
    },
    { status: 200 }
  );
}
