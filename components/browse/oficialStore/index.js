import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useRouter } from "next/router";

export default function OficialStores({ brands, brandHandler, replaceQuery }) {
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const handleShowAll = () => {
    setShowAll(!showAll);
  };
  return (
    <div className={styles.filter}>
      <h3>
        Tiendas oficiales: <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {brands?.slice(0, showAll ? brands?.length : 6)?.map((brand, i) => {
            const check = replaceQuery("brand", brand);
            return (
              <button
                key={i}
                className={`${styles.filter__brand} ${
                  check.active ? styles.activeFilter : ""
                }`}
                onClick={() => brandHandler(check.result)}
              >
                <img
                  src={`../../../images/brands/${brand}.png`}
                  alt="Mongir Logo"
                />
              </button>
            );
          })}
        </div>
      )}
      {brands?.length > 6 && (
        <div className={styles.showMore} onClick={handleShowAll}>
          {showAll ? "Mostrar menos..." : "Mostrar más..."}
        </div>
      )}
    </div>
  );
}
