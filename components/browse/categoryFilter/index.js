import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Card from "./Card";

export default function CategoryFilter({
  categories,
  subCategories,
  categoryHandler,
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
        Categorias:
        <span onClick={() => setShow(!show)}>
          {show ? <FaMinus /> : <BsPlusLg />}
        </span>
      </h3>
      {show && (
        <>
          {categories
            ?.slice(0, showAll ? categories.length : 6)
            .map((category, i) => (
              <Card
                key={i}
                category={category}
                subCategories={subCategories}
                categoryHandler={categoryHandler}
                replaceQuery={replaceQuery}
              />
            ))}
          {categories?.length > 6 && (
            <div className={styles.showMore} onClick={handleShowAll}>
              {showAll ? "Mostrar menos..." : "Mostrar más..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
