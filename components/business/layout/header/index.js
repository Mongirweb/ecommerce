import styles from "./styles.module.scss";
import Link from "next/link";
import image from "../../../../public/somos-el-hueco-medellin-logo-circulo.avif";
import Image from "next/image";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__left}>
          <Link href="/" prefetch={true}>
            <Image src={image} alt="empresy" loading="lazy" />
          </Link>
        </div>
      </div>
    </div>
  );
}
