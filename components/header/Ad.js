import Link from "next/link";
import styles from "./header.module.scss";
import { FaRegHeart } from "react-icons/fa";
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  weight: "800",
  subsets: ["latin"],
});

export default function Ad() {
  // Define your message once.
  const message = (
    <>
      <FaRegHeart size={16} />
      <p className={playfairDisplay.className}>
        El amor que tu bebé te inspira es el mismo amor que encontrarás en esta
        página
      </p>
      <FaRegHeart size={16} />
    </>
  );

  return (
    <Link href="/">
      <div className={styles.ad}>
        <div className={styles.marquee}>
          <div className={styles.marqueeContent}>{message}</div>
          <div className={styles.marqueeContent}>{message}</div>
          <div className={styles.marqueeContent}>{message}</div>
        </div>
      </div>
    </Link>
  );
}
