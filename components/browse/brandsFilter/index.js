import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Card from "./Card";

export default function BrandsFilter({ brands, brandHandler, replaceQuery }) {
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={styles.filter}>
      <h3>
        Marcas:
        <span onClick={() => setShow(!show)}>
          {show ? <FaMinus /> : <BsPlusLg />}
        </span>
      </h3>
      {show && (
        <>
          {brands?.slice(0, showAll ? brands?.length : 6)?.map((brand, i) => (
            <Card
              key={i}
              brand={brand}
              replaceQuery={replaceQuery}
              brandHandler={brandHandler}
            />
          ))}
          {brands?.length > 6 && (
            <div className={styles.showMore} onClick={handleShowAll}>
              {showAll ? "Mostrar menos..." : "Mostrar más..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
