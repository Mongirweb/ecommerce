import Link from "next/link";
import styles from "../styles/notfound.module.scss";
import Image from "next/image";
import image from "../public/somos-el-hueco-medellin-logo-circulo.avif";

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <Image
          className={styles.logo}
          src={image}
          alt="Mongir Logo"
          width={100}
          height={100}
          priority
        />
        <p>
          Oops! La pagina que buscas no fue encontrada. Retorna a la pagina
          principal.
        </p>
        <Link href="/" className={styles.homeLink}>
          ← Ir a Home
        </Link>
      </div>
    </div>
  );
}
