import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./styles.module.scss";

export default function MobileSort({ setOpenMenuSortMobile }) {
  const sortNames = [
    { name: "Recomendados" },
    { name: "Mayor precio" },
    { name: "Menor precio" },
  ];

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenu__options}>
        <div
          className={styles.mobileMenu__options_back}
          onClick={() => setOpenMenuSortMobile((prev) => !prev)}
        >
          <FaArrowLeft />
          <span>Volver</span>
        </div>
        <h2>Ordenar por:</h2>
        <div className={styles.mobileMenu__options_list}>
          <ul>
            {sortNames.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
