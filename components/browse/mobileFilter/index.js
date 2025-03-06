import React, { useState } from "react";
import styles from "./styles.module.scss";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CategoryFilter from "./categoryFilter";
import SubCategoryFilter from "./subCategoryFilter";
import PriceFilter from "./priceFilter";
import DiscountFilter from "./discountFilter";
import SizesFilter from "./sizesFilter";
import BrandsFilter from "./brandsFilter";
import GenderFilter from "./genderFilter";

export default function MobileMenuFilter({
  setOpenMenuMobile,
  filterData,
  discountHandler,
  brands,
  brandHandler,
  replaceQuery,
  sizes,
  sizeHandler,
  priceHandler,
  categories,
  categoryHandler,
  subCategorie2,
  subCategory2Handler,
  subCategories,
  subCategoryHandler,
  subCategorie3,
  subCategory3Handler,
}) {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const searchParams = useSearchParams();

  // Toggle the visibility of filter options
  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenu__options}>
        <div
          className={styles.mobileMenu__options_back}
          onClick={() => setOpenMenuMobile((prev) => !prev)}
        >
          <FaArrowLeft />
          <span>Volver</span>
        </div>

        <button
          className={styles.mobileMenu__clearBtn}
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
            Array.from(searchParams.keys()).filter((key) => key !== "category")
              .length
          }
          )
        </button>

        <h2>Filtrar por:</h2>
        <div className={styles.mobileMenu__options_list}>
          <ul>
            {searchParams.get("category") ? (
              <SubCategoryFilter
                expandedFilters={expandedFilters.subCategory}
                toggleFilter={() => toggleFilter("subCategory")}
                subCategorie2={subCategorie2}
                subCategory2Handler={subCategory2Handler}
                subCategories={subCategories}
                replaceQuery={replaceQuery}
                subCategoryHandler={subCategoryHandler}
                setOpenMenuMobile={setOpenMenuMobile}
                subCategorie3={subCategorie3}
                subCategory3Handler={subCategory3Handler}
              />
            ) : (
              <CategoryFilter
                expandedFilters={expandedFilters.category}
                toggleFilter={() => toggleFilter("category")}
                categories={categories}
                categoryHandler={categoryHandler}
                replaceQuery={replaceQuery}
                setOpenMenuMobile={setOpenMenuMobile}
              />
            )}

            <PriceFilter
              expandedFilters={expandedFilters.price}
              toggleFilter={() => toggleFilter("price")}
              priceHandler={priceHandler}
            />
            <DiscountFilter
              expandedFilters={expandedFilters.discount}
              toggleFilter={() => toggleFilter("discount")}
              discountHandler={discountHandler}
            />
            {sizes && sizes.length > 0 && (
              <SizesFilter
                expandedFilters={expandedFilters.sizes}
                toggleFilter={() => toggleFilter("sizes")}
                sizes={sizes}
                sizeHandler={sizeHandler}
              />
            )}
            <BrandsFilter
              expandedFilters={expandedFilters.brands}
              toggleFilter={() => toggleFilter("brands")}
              brands={brands}
              brandHandler={brandHandler}
              replaceQuery={replaceQuery}
            />
            {/* <GenderFilter
              expandedFilters={expandedFilters.gender}
              toggleFilter={() => toggleFilter("gender")}
            /> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
