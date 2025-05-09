import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./styles.module.scss";
import { useSearchParams } from "next/navigation";

export default function MobileSort({ setOpenMenuSortMobile, sortHandler }) {
  const searchParams = useSearchParams();
  const sortQuery = searchParams.get("sort") || "";
  const sortNames = [
    { name: "Recomendados", value: "" },
    { name: "Mayor precio", value: "priceHighToLow" },
    { name: "Menor precio", value: "priceLowToHigh" },
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
              <li
                key={index}
                onClick={() => {
                  sortHandler(item.value);
                  setOpenMenuSortMobile(false);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
