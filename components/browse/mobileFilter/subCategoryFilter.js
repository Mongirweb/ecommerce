import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";
import Card from "./Card";
import { useSearchParams } from "next/navigation";

export default function SubCategoryFilter({
  toggleFilter,
  expandedFilters,
  subCategorie2,
  subCategory2Handler,
  subCategories,
  replaceQuery,
  subCategoryHandler,
  setOpenMenuMobile,
  subCategorie3,
  subCategory3Handler,
}) {
  const searchParams = useSearchParams();
  const setCategory = searchParams.get("category");
  const setSubCategory = searchParams.get("subcategory");
  const setSubCategory2 = searchParams.get("subcategory2");
  const setSubCategory3 = searchParams.get("subcategory3");

  return (
    <li>
      <div className={styles.filterHeader} onClick={() => toggleFilter()}>
        <span>Subcategorías</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {!setSubCategory &&
            subCategories.map((category, i) => (
              <Card
                key={i}
                category={category}
                categoryHandler={subCategoryHandler}
                replaceQuery={replaceQuery}
                setOpenMenuMobile={setOpenMenuMobile}
              />
            ))}

          {setSubCategory &&
            !setSubCategory2 &&
            subCategorie2?.map((category, i) => (
              <Card
                key={i}
                category={category}
                categoryHandler={subCategory2Handler}
                replaceQuery={replaceQuery}
                setOpenMenuMobile={setOpenMenuMobile}
              />
            ))}

          {setSubCategory2 &&
            subCategorie3.length > 0 &&
            subCategorie3?.map((category, i) => (
              <Card
                key={i}
                category={category}
                categoryHandler={subCategory3Handler}
                replaceQuery={replaceQuery}
                setOpenMenuMobile={setOpenMenuMobile}
              />
            ))}
        </div>
      )}
    </li>
  );
}
