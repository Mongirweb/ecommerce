import styles from "./main.module.scss";

import dynamic from "next/dynamic";

const Recomended = dynamic(() => import("../recomended"), {
  ssr: false,
});

export default function Main({
  newRecomendedProducts,
  setRecomendedProductsPage,
}) {
  return (
    <div className={styles.main}>
      <Recomended
        products={newRecomendedProducts}
        setRecomendedProductsPage={setRecomendedProductsPage}
      />
    </div>
  );
}
