import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";

export default function GenderFilter({ toggleFilter, expandedFilters }) {
  return (
    <li>
      <div className={styles.filterHeader} onClick={() => toggleFilter()}>
        <span>Genero</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          <span>opciones</span>
        </div>
      )}
    </li>
  );
}
