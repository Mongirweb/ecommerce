import styles from "./footer.module.scss";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
export default function Socials() {
  return (
    <div className={styles.footer__socials}>
      <section>
        {/* <h3>SIGUENOS</h3> */}
        <ul>
          <li>
            <a
              href="https://www.facebook.com/share/1KL1aSYk2D/?mibextid=wwXIfr"
              target="_blank"
            >
              <FaFacebookF />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/somoselhuecomedellin?igsh=MTU0MWlpcTI0M2M3bQ%3D%3D&utm_source=qr"
              target="_blank"
            >
              <BsInstagram />
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@somoselhueco?_t=ZS-8tCtZGcPiMi&_r=1"
              target="_blank"
            >
              <FaTiktok />
            </a>
          </li>

          {/* <li>
            <a href="https://www.linkedin.com/company/empresy/" target="_blank">
              <BsLinkedin />
            </a>
          </li>
          <li>
            <a href="/" target="_blank">
              <BsYoutube />
            </a>
          </li>
          <li>
            <a href="/" target="_blank">
              <BsPinterest />
            </a>
          </li>
          <li>
            <a href="/" target="_blank">
              <BsSnapchat />
            </a>
          </li>
          */}
        </ul>
      </section>
    </div>
  );
}
