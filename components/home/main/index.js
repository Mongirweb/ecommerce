import Link from "next/link";
import Modal from "../../modal";
import Header from "./Header";
import styles from "./main.module.scss";
import Menu from "./Menu";
import Offers from "./offers";
import User from "./User";
import { useEffect, useState } from "react";
import { categories } from "../../../data/categorie";
import Recomended from "../recomended";

export default function Main({
  newRecomendedProducts,
  setRecomendedProductsPage,
}) {
  return (
    <div className={styles.main}>
      {/* <Header /> */}
      {/* <Menu setOpenCategory={setOpenCategory} /> */}
      <Recomended
        products={newRecomendedProducts}
        setRecomendedProductsPage={setRecomendedProductsPage}
      />
      {/* <User /> */}
    </div>
  );
}
