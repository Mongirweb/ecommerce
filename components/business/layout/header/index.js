import styles from "./styles.module.scss";
import Link from "next/link";
import image from "../../../../public/MONGIR-LOGO.png";
import Image from "next/image";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__left}>
          <Link href="/" prefetch={true}>
            <Image
              src={image}
              alt="Mongir Logo"
              loading="lazy"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
