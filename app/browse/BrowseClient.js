// app/browse/BrowseClient.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/browse.module.scss";
import { Pagination } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";

import CategoryFilter from "../../components/browse/categoryFilter";
import SizesFilter from "../../components/browse/sizesFilter";
import ColorsFilter from "../../components/browse/colorsFilter";
import BrandsFilter from "../../components/browse/brandsFilter";
import StylesFilter from "../../components/browse/stylesFilter";
import PatternsFilter from "../../components/browse/patternsFilter";
import MaterialsFilter from "../../components/browse/materialsFilter";
import GenderFilter from "../../components/browse/genderFilter";
import HeadingFilters from "../../components/browse/headingFilters";
import OficialStores from "../../components/browse/oficialStore";
import LocationFilter from "../../components/browse/locationFilter";
import PriceFilters from "../../components/browse/priceFilter";
import MenuOrder from "../../components/browse/menu_order";
import SubCategoryFilter from "../../components/browse/subCategoryFilter";
import { useModal } from "../../context/ModalContext";
import MobileMenuFilter from "../../components/browse/mobileFilter";
import MobileSort from "../../components/browse/mobileSort";
import SubCategoryFilter2 from "../../components/browse/subCategoryFilter2";
import SubCategoryFilter3 from "../../components/browse/subCategoryFilter3";
import DiscountFilter from "../../components/browse/discountFilter";

const ProductCard = dynamic(() => import("../../components/productCard"), {
  suspense: true,
});

export default function BrowseClient(props) {
  const {
    products,

    subCategories,
    subCategorie2,
    subCategorie3,
    sizes,
    colors,
    brands,
    stylesData,
    patterns,
    materials,
    paginationCount,
    country,
    categories,
    locations,
  } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const [openMenuSortMobile, setOpenMenuSortMobile] = useState(false);

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
    document.body.style.backgroundColor = "#fff";

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.style.backgroundColor = "#fff";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to handle filter changes and update the URL
  const filter = (filters) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        currentParams.set(key, filters[key]);
      } else {
        currentParams.delete(key);
      }
    });

    const queryString = currentParams.toString();
    router.push(`/browse?${queryString}`);
  };

  // Handler functions
  const searchHandler = (search) => {
    filter({ search });
  };

  const categoryHandler = (category) => {
    const searchKey = searchParams.get("search");
    if (searchKey) {
      // If there's a search query, remove it when selecting a category
      filter({ category, search: null });
    } else {
      // If there's no search query, just set the category
      filter({ category });
    }
  };

  const subCategoryHandler = (subcategory) => {
    filter({ subcategory: subcategory });
  };
  const subCategory2Handler = (subcategory2) => {
    filter({ subcategory2: subcategory2 });
  };

  const subCategory3Handler = (subcategory3) => {
    filter({ subcategory3: subcategory3 });
  };

  const locationHandler = (location) => {
    filter({ location });
  };
  const brandHandler = (brand) => {
    filter({ brand });
  };
  const sizeHandler = (size) => {
    filter({ size });
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

  // ... Other handler functions ...

  // Check if a filter value is active
  function checkChecked(queryName, value) {
    const paramValue = searchParams.get(queryName);
    if (paramValue && paramValue.includes(value)) {
      return true;
    }
    return false;
  }

  // Replace or toggle filter values in the query
  function replaceQuery(queryName, value) {
    const existedQuery = searchParams.get(queryName);
    const valueCheck = existedQuery?.indexOf(value);
    const _check = existedQuery?.indexOf(`_${value}`);
    let result = "";
    if (existedQuery) {
      if (existedQuery === value) {
        result = "";
      } else {
        if (valueCheck !== -1) {
          if (_check !== -1) {
            result = existedQuery?.replace(`_${value}`, "");
          } else if (valueCheck === 0) {
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

  const priceHandler = (minPrice, maxPrice) => {
    filter({ price: `${minPrice}_${maxPrice}` });
  };

  // Pagination handler
  const pageHandler = (e, page) => {
    filter({ page });
  };

  useEffect(() => {
    if (openMenuMobile || openMenuSortMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openMenuMobile, openMenuSortMobile]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // In your parent component
  const discountHandler = (minDiscount, maxDiscount) => {
    const params = new URLSearchParams(window.location.search);

    // Remove existing discount parameter
    params.delete("discount");

    // Add new discount parameter
    params.set("discount", `${minDiscount}_${maxDiscount}`);
    filter({ discount: `${minDiscount}_${maxDiscount}` });
  };
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const subcategory2 = searchParams.get("subcategory2");
  const subcategory3 = searchParams.get("subcategory3");
  return (
    <>
      {openMenuMobile && (
        <MobileMenuFilter
          setOpenMenuMobile={setOpenMenuMobile}
          discountHandler={discountHandler}
          brands={brands}
          brandHandler={brandHandler}
          replaceQuery={replaceQuery}
          sizes={sizes}
          sizeHandler={sizeHandler}
          priceHandler={priceHandler}
          categories={categories}
          categoryHandler={categoryHandler}
          subCategorie2={subCategorie2}
          subCategory2Handler={subCategory2Handler}
          subCategories={subCategories}
          subCategoryHandler={subCategoryHandler}
          subCategorie3={subCategorie3}
          subCategory3Handler={subCategory3Handler}
        />
      )}
      {openMenuSortMobile && (
        <MobileSort setOpenMenuSortMobile={setOpenMenuSortMobile} />
      )}
      <div className={styles.browse__container}>
        <div ref={headerRef}>
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
          ref={el}
          className={
            query670px
              ? styles.browse__store
              : `${styles.browse__store} ${
                  scrollY >= height - 570 ? styles.fixed : ""
                }`
          }
        >
          <div
            className={`${styles.browse__store_filters} ${styles.scrollbar}`}
          >
            <button
              className={styles.browse__clearBtn}
              onClick={() => {
                const category = searchParams.get("category");
                const newQuery = category ? { category } : {};

                // Construct the URL by combining pathname and query
                const queryString = new URLSearchParams(newQuery).toString();
                const newPath = `${pathname}?${queryString}`;

                // Update the URL with the constructed path
                router.push(newPath); // Use constructed string for navigation
              }}
            >
              Limpiar filtros (
              {
                Array.from(searchParams.keys()).filter(
                  (key) => key !== "category"
                ).length
              }
              )
            </button>

            {/* Category & Subcategory Filters */}
            {!category && (
              /* NO category selected => show main CategoryFilter */
              <CategoryFilter
                categories={categories}
                categoryHandler={categoryHandler}
                replaceQuery={replaceQuery}
              />
            )}

            {category && !subcategory && subCategories?.length > 0 && (
              /* Category is selected, subcategory is NOT => show SubCategoryFilter */
              <SubCategoryFilter
                subCategories={subCategories}
                replaceQuery={replaceQuery}
                subCategoryHandler={subCategoryHandler}
              />
            )}

            {category &&
              subcategory &&
              !subcategory2 &&
              subCategorie2?.length > 0 && (
                /* Category & subcategory are selected, subcategory2 is NOT => show SubCategoryFilter2 */
                <SubCategoryFilter2
                  subCategorie2={subCategorie2}
                  replaceQuery={replaceQuery}
                  subCategory2Handler={subCategory2Handler}
                />
              )}
            {category &&
              subcategory &&
              !subcategory2 &&
              subCategorie2?.length <= 0 && (
                /* Category & subcategory are selected, subcategory2 is NOT => show SubCategoryFilter2 */
                <SubCategoryFilter
                  subCategories={subCategories}
                  replaceQuery={replaceQuery}
                  subCategoryHandler={subCategoryHandler}
                />
              )}
            {category &&
              subcategory &&
              subcategory2 &&
              !subcategory3 &&
              subCategorie3?.length <= 0 && (
                /* Category, subcategory, & subcategory2 are selected, subcategory3 is NOT => show SubCategoryFilter3 */
                <SubCategoryFilter2
                  subCategorie2={subCategorie2}
                  replaceQuery={replaceQuery}
                  subCategory2Handler={subCategory2Handler}
                />
              )}

            {category &&
              subcategory &&
              subcategory2 &&
              !subcategory3 &&
              subCategorie3?.length > 0 && (
                /* Category, subcategory, & subcategory2 are selected, subcategory3 is NOT => show SubCategoryFilter3 */
                <SubCategoryFilter3
                  subCategorie3={subCategorie3}
                  replaceQuery={replaceQuery}
                  subCategory3Handler={subCategory3Handler}
                />
              )}

            {category && subcategory && subcategory2 && subcategory3 && (
              /* Category, subcategory, & subcategory2 are selected, subcategory3 is NOT => show SubCategoryFilter3 */
              <SubCategoryFilter3
                subCategorie3={subCategorie3}
                replaceQuery={replaceQuery}
                subCategory3Handler={subCategory3Handler}
              />
            )}

            {/* <LocationFilter
          locations={locations}
          subCategories={subCategories}
          locationHandler={locationHandler}
          replaceQuery={replaceQuery}
        /> */}
            <PriceFilters priceHandler={priceHandler} />
            <DiscountFilter discountHandler={discountHandler} />

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
              <MenuOrder
                setOpenMenuMobile={setOpenMenuMobile}
                setOpenMenuSortMobile={setOpenMenuSortMobile}
              />
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

            {products.length === 0 ? (
              <div className={styles.noProductsMessage}>
                <p>No hay productos disponibles con el término de búsqueda.</p>
              </div>
            ) : (
              <div className={styles.browse__store_products}>
                {products.map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))}
              </div>
            )}
            <div className={styles.pagination}>
              <Pagination
                count={paginationCount}
                defaultPage={Number(searchParams.page) || 1}
                onChange={pageHandler}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
