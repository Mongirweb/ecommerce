import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Card from "./Card";

export default function SubCategoryFilter2({
  subCategorie2,
  subCategory2Handler,
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
          {subCategorie2
            ?.slice(0, showAll ? subCategorie2.length : 6)
            .map((subcategory, i) => (
              <Card
                key={i}
                subcategory={subcategory}
                subCategory2Handler={subCategory2Handler}
                replaceQuery={replaceQuery}
              />
            ))}
          {subCategorie2?.length > 6 && (
            <div className={styles.showMore} onClick={handleShowAll}>
              {showAll ? "Mostrar menos..." : "Mostrar más..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
