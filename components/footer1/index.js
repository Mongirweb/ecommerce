import Copyright from "./Copyright";
import Links from "./Links";

import Payment from "./Payment";
import Socials from "./Socials";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <Links />
        <Socials />
        <Payment />
        <Copyright />
      </div>
    </footer>
  );
}
