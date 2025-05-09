import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";

export default function OficialStores({
  companies,
  companyHandler,
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
        Tiendas oficiales: <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {companies
            ?.slice(0, showAll ? companies?.length : 6)
            ?.map((company, i) => {
              const check = replaceQuery("company", company._id);
              return (
                <button
                  key={i}
                  className={`${styles.filter__brand} ${
                    check.active ? styles.activeFilter : ""
                  }`}
                  onClick={() => companyHandler(check.result)}
                >
                  <Image
                    src={company?.image}
                    alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                    width={50}
                    height={50}
                    loading="lazy"
                    style={{ borderRadius: "50%" }}
                  />
                  <span>
                    {company?.businessName.charAt(0).toUpperCase() +
                      company?.businessName
                        .substring(1)
                        .toLowerCase()
                        .substring(0, 8)}
                  </span>
                </button>
              );
            })}
        </div>
      )}
      {companies?.length > 6 && (
        <div className={styles.showMore} onClick={handleShowAll}>
          {showAll ? "Mostrar menos..." : "Mostrar más..."}
        </div>
      )}
    </div>
  );
}
