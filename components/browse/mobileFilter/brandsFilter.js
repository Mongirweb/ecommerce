import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";

export default function BrandsFilter({
  toggleFilter,
  expandedFilters,
  brands,
  brandHandler,
  replaceQuery,
  setOpenMenuMobile,
}) {
  return (
    <li>
      <div
        className={styles.filterHeader}
        onClick={() => {
          toggleFilter();
        }}
      >
        <span>Marcas</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {brands?.map((brand, i) => (
            <span
              key={i}
              onClick={() => {
                brandHandler(brand);
                setOpenMenuMobile(false);
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
