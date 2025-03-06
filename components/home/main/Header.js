import Link from "next/link";
import styles from "./main.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
      {/* <ul>
        <li>
          <Link href="">Store</Link>
        </li>
        <li>
          <Link href="">Electronics</Link>
        </li>
        <li>
          <Link href="">Watches</Link>
        </li>
      </ul> */}
      <div>
        <span style={{ fontSize: "20px", fontWeight: "600" }}>
        ¡Bienvenido a Empresy! Productos locales para ti y tu empresa.
        </span>
      </div>
    </div>
  );
}
