import styles from "../styles/browse.module.scss";
import db from "../utils/db";
import Product from "../models/Product";
// import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../utils/arrays_utils";
import Link from "next/link";
import CategoryFilter from "../components/browse/categoryFilter";
import SizesFilter from "../components/browse/sizesFilter";
import ColorsFilter from "../components/browse/colorsFilter";
import BrandsFilter from "../components/browse/brandsFilter";
import StylesFilter from "../components/browse/stylesFilter";
import PatternsFilter from "../components/browse/patternsFilter";
import MaterialsFilter from "../components/browse/materialsFilter";
import GenderFilter from "../components/browse/genderFilter";
import HeadingFilters from "../components/browse/headingFilters";
import { useRouter } from "next/router";
import { Pagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { categories } from "../data/categorie";
import OficialStores from "../components/browse/oficialStore";
import LocationFilter from "../components/browse/locationFilter";
import PriceFilters from "../components/browse/priceFilter";
import { useMediaQuery } from "react-responsive";
import locations from "../data/locations.json";
import MenuOrder from "../components/browse/menu_order";
import dynamic from "next/dynamic";
import SubCategoryFilter from "../components/browse/subCategoryFilter";

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  //-------------------------------------------------->
  const searchQuery = query.search || "";
  const categoryQuery = query.category || "";
  const genderQuery = query.gender || "";
  const priceQuery = query.price?.split("_") || "";
  const subCategoryQuery = query.subcategory || "";
  const shippingQuery = query.shipping || 0;
  const ratingQuery = query.rating || "";
  const sortQuery = query.sort || "";
  const pageSize = 50;
  const page = query.page || 1;

  //-----------
  const brandQuery = query.brand?.split("_") || "";
  const brandRegex = `^${brandQuery[0]}`;
  const brandSearchRegex = createRegex(brandQuery, brandRegex);
  //-----------
  //-----------
  const styleQuery = query.style?.split("_") || "";
  const styleRegex = `^${styleQuery[0]}`;
  const styleSearchRegex = createRegex(styleQuery, styleRegex);
  //-----------
  //-----------
  const patternQuery = query.pattern?.split("_") || "";
  const patternRegex = `^${patternQuery[0]}`;
  const patternSearchRegex = createRegex(patternQuery, patternRegex);
  //-----------
  //-----------
  const materialQuery = query.material?.split("_") || "";
  const materialRegex = `^${materialQuery[0]}`;
  const materialSearchRegex = createRegex(materialQuery, materialRegex);
  //-----------
  const sizeQuery = query.size?.split("_") || "";
  const sizeRegex = `^${sizeQuery[0]}`;
  const sizeSearchRegex = createRegex(sizeQuery, sizeRegex);
  //-----------
  const colorQuery = query.color?.split("_") || "";
  const colorRegex = `^${colorQuery[0]}`;
  const colorSearchRegex = createRegex(colorQuery, colorRegex);

  //-------------------------------------------------->
  const search =
    searchQuery && searchQuery !== ""
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const category =
    categoryQuery && categoryQuery !== "" ? { category: categoryQuery } : {};

  const subCategory =
    subCategoryQuery && subCategoryQuery !== ""
      ? { subCategories: { $in: [subCategoryQuery] } } // Use $in for array matching
      : {};

  const style =
    styleQuery && styleQuery !== ""
      ? {
          "details.value": {
            $regex: styleSearchRegex,
            $options: "i",
          },
        }
      : {};
  const size =
    sizeQuery && sizeQuery !== ""
      ? {
          "subProducts.sizes.size": {
            $regex: sizeSearchRegex,
            $options: "i",
          },
        }
      : {};
  const color =
    colorQuery && colorQuery !== ""
      ? {
          "subProducts.color.color": {
            $regex: colorSearchRegex,
            $options: "i",
          },
        }
      : {};
  const brand =
    brandQuery && brandQuery !== ""
      ? {
          brand: {
            $regex: brandSearchRegex,
            $options: "i",
          },
        }
      : {};
  const pattern =
    patternQuery && patternQuery !== ""
      ? {
          "details.value": {
            $regex: patternSearchRegex,
            $options: "i",
          },
        }
      : {};
  const material =
    materialQuery && materialQuery !== ""
      ? {
          "details.value": {
            $regex: materialSearchRegex,
            $options: "i",
          },
        }
      : {};
  const gender =
    genderQuery && genderQuery !== ""
      ? {
          "details.value": {
            $regex: genderQuery,
            $options: "i",
          },
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
  const shipping =
    shippingQuery && shippingQuery == "0"
      ? {
          shipping: 0,
        }
      : {};
  const rating =
    ratingQuery && ratingQuery !== ""
      ? {
          rating: {
            $gte: Number(ratingQuery),
          },
        }
      : {};
  const sort =
    sortQuery == ""
      ? {}
      : sortQuery == "popular"
      ? { rating: -1, "subProducts.sold": -1 }
      : sortQuery == "newest"
      ? { createdAt: -1 }
      : sortQuery == "topSelling"
      ? { "subProducts.sold": -1 }
      : sortQuery == "topReviewed"
      ? { rating: -1 }
      : sortQuery == "priceHighToLow"
      ? { "subProducts.sizes.price": -1 }
      : sortQuery == "priceLowToHigh"
      ? { "subProducts.sizes.price": 1 }
      : {};
  //-------------------------------------------------->
  //-------------------------------------------------->
  function createRegex(data, styleRegex) {
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        styleRegex += `|^${data[i]}`;
      }
    }
    return styleRegex;
  }

  let data = await axios
    .get("https://api.ipregistry.co/?key=r208izz0q0icseks")
    .then((res) => {
      return res.data.location.country;
    })
    .catch((err) => {
      console.log(err);
    });

  //-------------------------------------------------->
  await db.connectDb();
  let subCategories = [];
  if (categoryQuery) {
    subCategories = await SubCategory.find({ parent: categoryQuery }).lean();
  }

  // Find the category object based on the query
  const categoryObj = categories.find(
    (c) => c.slug === categoryQuery || c.id === categoryQuery
  );

  let productsDb = await Product.find({
    ...search,
    ...category,
    ...subCategory,
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
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort(sort)
    .lean();
  let products =
    sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);
  // let categories = await Category.find().lean();
  // let subCategories = await SubCategory.find()
  //   .populate({
  //     path: "parent",
  //     model: Category,
  //   })
  //   .lean();
  let colors = await Product.find({ ...category }).distinct(
    "subProducts.color.color"
  );
  let brandsDb = await Product.find({ ...category }).distinct("brand");
  let sizes = await Product.find({ ...category }).distinct(
    "subProducts.sizes.size"
  );
  let details = await Product.find({ ...category }).distinct("details");
  let stylesDb = filterArray(details, "Style");
  let patternsDb = filterArray(details, "Pattern Type");
  let materialsDb = filterArray(details, "Material");
  let styles = removeDuplicates(stylesDb);
  let patterns = removeDuplicates(patternsDb);
  let materials = removeDuplicates(materialsDb);
  let brands = removeDuplicates(brandsDb);
  let totalProducts = await Product.countDocuments({
    ...search,
    ...category,
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
  });
  const openGraphData = [
    {
      property: "og:site_name",
      content: "Somos el Hueco Medellín",
      key: "ogsitename",
    },
    {
      property: "og:title",
      content: `Categoría - ${categoryObj?.name}`,
      key: "default-ogtitle",
    },
    {
      property: "og:image:width",
      content: "600",
      key: "ogimagewidth",
    },
    {
      property: "og:image:height",
      content: "400",
      key: "ogimageheight",
    },
    {
      property: "og:description",
      content: `Explora SaldoMania y descubre los últimos estilos. Encuentra increíbles saldos saldo ofertas en ${categoryObj?.name} en SaldoMania. Pago en línea rápido y seguro`,
      key: "default-ogdesc",
    },
    {
      property: "og:image",
      content: `${categoryObj?.image}`,
      key: "default-ogimage",
    },
    {
      property: "og:url",
      content: `https://www.saldomania.com/browse?category=${categoryObj?.id}`,
      key: "default-ogurl",
    },
    {
      property: "og:type",
      content: "website",
      key: "default-ogtype",
    },
    // Twitter Card properties
    {
      property: "twitter:card",
      content: "summary_large_image", // Can also be "summary" for smaller images
      key: "twittercard",
    },
    {
      property: "twitter:site",
      content: "@SaldoMania", // Replace with your Twitter handle
      key: "twittersite",
    },
    {
      property: "twitter:title",
      content: `Categoría - ${categoryObj?.name}`,
      key: "twittertitle",
    },
    {
      property: "twitter:description",
      content: `Explora SaldoMania y descubre los últimos estilos. Encuentra increíbles ofertas en ${categoryObj?.name} en SaldoMania. Pago en línea rápido y seguro.`,
      key: "twitterdesc",
    },
    {
      property: "twitter:image",
      content: `${categoryObj?.image}`,
      key: "twitterimage",
    },
    {
      type: "application/ld+json",
      key: "jsonld",
      content: JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Product",
        name: categoryObj?.name,
        image: categoryObj?.image,
        description: `Explora las últimas tendencias y ofertas en ${categoryObj?.name}`,
        url: `https://www.saldomania.com/browse?category=${categoryObj?.id}`,
        brand: {
          "@type": "Brand",
          name: "SaldoMania",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "COP",
          price: "1234", // Replace with actual price data
          availability: "http://schema.org/InStock",
          url: `https://www.saldomania.com/browse?category=${categoryObj?.id}`,
        },
      }),
    },
  ];
  const title = `SaldoMania - Categoria ${categoryObj?.name}`;
  const keywords =
    "Saldomania saldo saldos, saldo saldos Ropa, saldo saldos Tienda de moda en línea, saldo saldos saldomania.com, saldo saldos Compras en línea, saldo saldos Ropa de mujer, saldo saldos Hogar y jardín, saldo saldos Joyas y accesorios, saldo saldos Belleza y salud, saldo saldos Electrónica, saldo saldos Ropa para hombres, saldo saldos Moda para niños, saldo saldos Zapatos y bolsos, saldo saldos Suministros para mascotas, saldo saldos Productos para bebés, saldo saldos Deportes y actividades al aire libre, saldo saldos Ropa interior y ropa de dormir, saldo saldos Productos de oficina, saldo saldos Industrial, saldo saldos Automotriz y motocicleta, saldo, saldos";

  return {
    props: {
      // categories: JSON.parse(JSON.stringify(categories)),
      openGraphData: JSON.parse(JSON.stringify(openGraphData)),
      title,
      keywords,
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      sizes,
      colors,
      brands,
      stylesData: styles,
      patterns,
      materials,
      paginationCount: Math.ceil(totalProducts / pageSize),
      country: {
        name: "Morocco",
        flag: "https://cdn-icons-png.flaticon.com/512/197/197551.png?w=360",
      },
    },
  };
}

const ProductCard = dynamic(() => import("../components/productCard"), {
  suspense: true,
});
const Header = dynamic(() => import("../components/header"), {
  suspense: true,
});

export default function Browse({
  subCategories,
  products,
  sizes,
  colors,
  brands,
  stylesData,
  patterns,
  materials,
  paginationCount,
  country,
}) {
  const router = useRouter();
  const { category } = router.query;
  const filter = ({
    search,
    category,
    brand,
    style,
    size,
    color,
    pattern,
    material,
    gender,
    price,
    shipping,
    rating,
    sort,
    page,
    location,
    subcategory,
  }) => {
    const path = router.pathname;

    const { query } = router;

    if (search) query.search = search;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (style) query.style = style;
    if (size) query.size = size;
    if (color) query.color = color;
    if (pattern) query.pattern = pattern;
    if (material) query.material = material;
    if (gender) query.gender = gender;
    if (price) query.price = price;
    if (shipping) query.shipping = shipping;
    if (rating) query.rating = rating;
    if (sort) query.sort = sort;
    if (page) query.page = page;
    if (location) query.location = location;
    if (subcategory) query.subcategory = subcategory;
    router.push({
      pathname: path,
      query: query,
    });
  };
  const searchHandler = (search) => {
    if (search == "") {
      filter({ search: {} });
    } else {
      filter({ search });
    }
  };
  const categoryHandler = (category) => {
    filter({ category });
  };
  const subCategoryHandler = (subcategory) => {
    filter({ subcategory });
  };
  const locationHandler = (location) => {
    // Create a new query object that only contains the selected location
    const newQuery = {
      ...router.query, // Keep the existing query parameters
      location, // Set the selected location
    };

    // Update the URL with the new query parameters
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });

    // Trigger the filter function with the new location
    filter({ location });
  };
  const brandHandler = (brand) => {
    filter({ brand });
  };
  const styleHandler = (style) => {
    filter({ style });
  };
  const sizeHandler = (size) => {
    filter({ size });
  };
  const colorHandler = (color) => {
    filter({ color });
  };
  const patternHandler = (pattern) => {
    filter({ pattern });
  };
  const materialHandler = (material) => {
    filter({ material });
  };
  const genderHandler = (gender) => {
    if (gender == "Unisex") {
      filter({ gender: {} });
    } else {
      filter({ gender });
    }
  };
  const priceHandler = (price, type) => {
    let priceQuery = router.query.price?.split("_") || "";
    let min = priceQuery[0] || "";
    let max = priceQuery[1] || "";
    let newPrice = "";
    if (type == "min") {
      newPrice = `${price}_${max}`;
    } else {
      newPrice = `${min}_${price}`;
    }
    filter({ price: newPrice });
  };
  const multiPriceHandler = (min, max) => {
    filter({ price: `${min}_${max}` });
  };
  const shippingHandler = (shipping) => {
    filter({ shipping });
  };

  const ratingHandler = (rating) => {
    filter({ rating });
  };
  const sortHandler = (sort) => {
    if (sort == "") {
      filter({ sort: {} });
    } else {
      filter({ sort });
    }
  };
  const pageHandler = (e, page) => {
    filter({ page });
  };
  //----------
  function checkChecked(queryName, value) {
    if (router.query[queryName]?.search(value) !== -1) {
      return true;
    }
    return false;
  }
  function replaceQuery(queryName, value) {
    queryName, value;
    const existedQuery = router.query[queryName];
    const valueCheck = existedQuery?.search(value);
    const _check = existedQuery?.search(`_${value}`);
    let result = "";
    if (existedQuery) {
      if (existedQuery == value) {
        result = {};
      } else {
        if (valueCheck !== -1) {
          if (_check !== -1) {
            result = existedQuery?.replace(`_${value}`, "");
          } else if (valueCheck == 0) {
            result = existedQuery?.replace(`${value}_`, "");
          } else {
            result = existedQuery?.replace(value, "");
          }
        } else {
          result = `${existedQuery}_${value}`;
        }
      }
    } else {
      result = value;
    }
    return {
      result,
      active: existedQuery && valueCheck !== -1 ? true : false,
    };
  }
  //---------------------------------
  const [scrollY, setScrollY] = useState(0);
  const [height, setHeight] = useState(0);

  const headerRef = useRef(null);
  const query670px = useMediaQuery({
    query: "(max-width:670px)",
  });

  const el = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    setHeight(headerRef.current?.offsetHeight + el.current?.offsetHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#fff"; // Set background color on mount

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.style.backgroundColor = "#fff"; // Reset on component unmount
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //---------------------------------
  return (
    <div className={styles.browse}>
      <div ref={headerRef}>
        <Header searchHandler={searchHandler} country={country} />
      </div>
      <div className={styles.browse__container}>
        <div ref={el}>
          <div className={styles.browse__path}>Home / Browse</div>
          {/* <div className={styles.browse__tags}>
            {categories?.map((c) => (
              <Link legacyBehavior href="" key={c._id}>
                <a>{c.name}</a>
              </Link>
            ))}
          </div> */}
        </div>
        <div
          className={
            query670px
              ? styles.browse__store
              : `${styles.browse__store} ${
                  scrollY >= height ? styles.fixed : ""
                }`
          }
        >
          <div
            className={`${styles.browse__store_filters} ${styles.scrollbar}`}
          >
            <button
              className={styles.browse__clearBtn}
              onClick={() => {
                // Create a new query object preserving the category
                const { category } = router.query;
                const newQuery = category ? { category } : {};

                // Update the URL with the new query parameters, preserving only the category
                router.push({
                  pathname: router.pathname,
                  query: newQuery,
                });
              }}
            >
              Limpiar todo (
              {
                Object.keys(router.query).filter((key) => key !== "category")
                  .length
              }
              )
            </button>
            {category ? (
              <SubCategoryFilter
                subCategories={subCategories}
                replaceQuery={replaceQuery}
                subCategoryHandler={subCategoryHandler}
              />
            ) : (
              <CategoryFilter
                categories={categories}
                categoryHandler={categoryHandler}
                replaceQuery={replaceQuery}
              />
            )}
            <LocationFilter
              locations={locations}
              subCategories={subCategories}
              locationHandler={locationHandler}
              replaceQuery={replaceQuery}
            />
            <PriceFilters priceHandler={priceHandler} />

            {/* <ColorsFilter
              colors={colors}
              colorHandler={colorHandler}
              replaceQuery={replaceQuery}
            /> */}

            {/* <StylesFilter
              data={stylesData}
              styleHandler={styleHandler}
              replaceQuery={replaceQuery}
            /> */}
            {/* <PatternsFilter
              patterns={patterns}
              patternHandler={patternHandler}
              replaceQuery={replaceQuery}
            />
            <MaterialsFilter
              materials={materials}
              materialHandler={materialHandler}
              replace Query={replaceQuery}
            /> */}
            <OficialStores
              brands={brands}
              brandHandler={brandHandler}
              replaceQuery={replaceQuery}
            />
            <BrandsFilter
              brands={brands}
              brandHandler={brandHandler}
              replaceQuery={replaceQuery}
            />
            {sizes && sizes.length > 0 && (
              <SizesFilter sizes={sizes} sizeHandler={sizeHandler} />
            )}
            {products.some((product) => product.gender) && (
              <GenderFilter
                genderHandler={genderHandler}
                replaceQuery={replaceQuery}
              />
            )}
          </div>
          <div className={styles.browse__store_products_wrap}>
            {query670px ? (
              <MenuOrder />
            ) : (
              <HeadingFilters
                priceHandler={priceHandler}
                multiPriceHandler={multiPriceHandler}
                shippingHandler={shippingHandler}
                ratingHandler={ratingHandler}
                replaceQuery={replaceQuery}
                sortHandler={sortHandler}
              />
            )}

            <div className={styles.browse__store_products}>
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
            <div className={styles.pagination}>
              <Pagination
                count={paginationCount}
                defaultPage={Number(router.query.page) || 1}
                onChange={pageHandler}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
