import Link from "next/link";
import styles from "./header.module.scss";
import { BsFire } from "react-icons/bs";

export default function MobileMenu({ setShowMenuMobile, handleOpenModal }) {
  return (
    <div className={styles.menumobile}>
      <h4>Menu</h4>
      <ul>
        {/* <li>
          <Link href="/browse" prefetch={true}>
            <BsFire /> Hot Sale
          </Link>
        </li> */}
        <li
          onClick={() => {
            handleOpenModal();
            setShowMenuMobile((prev) => !prev);
          }}
        >
          <span>Categorías</span>
        </li>
      </ul>
    </div>
  );
}
