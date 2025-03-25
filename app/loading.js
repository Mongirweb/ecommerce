// components/Loading.jsx

import Image from "next/image";
import image from "../public/MONGIR-LOGO.png";
import styles from "../styles/loading.module.scss"; // Adjust the path if necessary

export default function Loading() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo}
        src={image}
        alt="Mongir Logo"
        width={200}
        height={200}
        priority
      />
    </div>
  );
}
