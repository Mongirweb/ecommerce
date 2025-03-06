import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Card from "./Card";

export default function LocationFilter({
  locations,
  locationHandler,
  replaceQuery,
}) {
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={styles.filter}>
      <h3>
        Ubicación:
        <span onClick={() => setShow(!show)}>
          {show ? <FaMinus /> : <BsPlusLg />}
        </span>
      </h3>
      {show && (
        <>
          {locations
            ?.slice(0, showAll ? locations.length : 6)
            .map((location, i) => (
              <Card
                key={i}
                location={location}
                locationHandler={locationHandler}
                replaceQuery={replaceQuery}
              />
            ))}
          {locations?.length > 6 && (
            <div className={styles.showMore} onClick={handleShowAll}>
              {showAll ? "Mostrar menos..." : "Mostrar más..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
