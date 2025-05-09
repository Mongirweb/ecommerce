import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Card from "./Card";

export default function SubCategoryFilter3({
  subCategorie3,
  subCategory3Handler,
  replaceQuery,
}) {
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = (event) => {
    event.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className={styles.filter}>
      <h3>
        Subcategorías:
        <span onClick={() => setShow(!show)}>
          {show ? <FaMinus /> : <BsPlusLg />}
        </span>
      </h3>
      {show && (
        <>
          {subCategorie3
            ?.slice(0, showAll ? subCategorie3.length : 6)
            .map((subcategory, i) => (
              <Card
                key={i}
                subcategory={subcategory}
                subCategory3Handler={subCategory3Handler}
                replaceQuery={replaceQuery}
              />
            ))}
          {subCategorie3?.length > 6 && (
            <div className={styles.showMore} onClick={handleShowAll}>
              {showAll ? "Mostrar menos..." : "Mostrar más..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
