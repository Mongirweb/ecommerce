import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";
import Card from "./Card";

export default function CategoryFilter({
  toggleFilter,
  expandedFilters,
  categories,
  categoryHandler,
  replaceQuery,
  setOpenMenuMobile,
}) {
  return (
    <li>
      <div className={styles.filterHeader} onClick={() => toggleFilter()}>
        <span>Categorías</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {categories.map((category, i) => (
            <Card
              key={i}
              category={category}
              categoryHandler={categoryHandler}
              replaceQuery={replaceQuery}
              setOpenMenuMobile={setOpenMenuMobile}
            />
          ))}
        </div>
      )}
    </li>
  );
}
