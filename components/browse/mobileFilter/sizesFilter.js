import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";
import { useSearchParams } from "next/navigation";

export default function SizesFilter({
  toggleFilter,
  expandedFilters,
  sizes,
  sizeHandler,
}) {
  const searchParams = useSearchParams();
  const existedSize = searchParams.get("size") || "";

  return (
    <li>
      <div className={styles.filterHeader} onClick={() => toggleFilter()}>
        <span>Tallas</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {sizes?.map((size, i) => (
            <div
              key={i}
              onClick={() =>
                sizeHandler(existedSize ? `${existedSize}_${size}` : size)
              }
              className={
                existedSize === size ? styles.activeOption : styles.option
              }
            >
              {size}
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
