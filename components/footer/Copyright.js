import Link from "next/link";
import styles from "./footer.module.scss";
import { IoLocationSharp } from "react-icons/io5";
import Image from "next/image";
import sic from "../../public/images/sic.png";
export default function Copyright() {
  const data = [
    // {
    //   name: "Términos y condiciones",
    //   link: "",
    // },
    // {
    //   name: "Promociones",
    //   link: "",
    // },
    // {
    //   name: "Politica de Privacidad",
    //   link: "",
    // },
    // {
    //   name: "Trabaja con nosotros",
    //   link: "",
    // },
    // {
    //   name: "Ayuda / PQR",
    //   link: "",
    // },
  ];

  return (
    <div className={styles.footer__copyright}>
      <section>©2025 Distribuidora Mongir</section>
      <section>
        <ul>
          {data?.map((link, i) => (
            <li key={i}>
              <Link href={link.link} prefetch={true}>
                {link?.name}
              </Link>
            </li>
          ))}
          <li>
            <a>
              <IoLocationSharp /> Colombia
            </a>
          </li>
          <li>
            <Link
              href="https://sedeelectronica.sic.gov.co/"
              target="_blank"
              prefetch={true}
            >
              <Image src={sic} width={300} height={100} alt="SIC" />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
