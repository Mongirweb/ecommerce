// components/Loading.jsx

import Image from "next/image";
import image from "../public/somos-el-hueco-medellin-logo-circulo.avif";
import styles from "../styles/loading.module.scss"; // Adjust the path if necessary

export default function Loading() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo}
        src={image}
        alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
        width={200}
        height={200}
        priority
      />
    </div>
  );
}
