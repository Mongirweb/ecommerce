import React from "react";
import styles from "./styles.module.scss";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { MdFilterList } from "react-icons/md";

export default function MenuOrder({
  setOpenMenuMobile,
  setOpenMenuSortMobile,
}) {
  return (
    <div className={styles.menu_mobile}>
      <div
        className={styles.menu_mobile__option}
        onClick={() => setOpenMenuSortMobile((prev) => !prev)}
      >
        <span>
          <HiMiniArrowsUpDown />
          Ordenar
        </span>
      </div>
      <p>|</p>

      <div
        className={styles.menu_mobile__option}
        onClick={() => setOpenMenuMobile((prev) => !prev)}
      >
        <span>
          <MdFilterList />
          Filtrar
        </span>
      </div>
    </div>
  );
}
