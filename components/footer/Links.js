import Link from "next/link";
import styles from "./footer.module.scss";
import { categories } from "../../data/categorie";

export default function Links() {
  const links = [
    {
      heading: "Distribuidora Mongir",
      links: [
        // { name: "Sobre SaldoManía", link: "" },
        // { name: "Vende en Somos el Hueco", link: "/newcommerce" },
        { name: "Términos y condiciones", link: "/terms" },
        { name: "Política de Privacidad", link: "/privacy" },
        // { name: "Trabaja con nosotros", link: "" },
      ],
    },
    // {
    //   heading: "SOPORTE",
    //   links: [
    //     { name: "Información de Envios", link: "" },
    //     { name: "Devoluciones", link: "" },
    //     { name: "Como Comprar", link: "" },
    //     { name: "Como Rastrear mi pedido", link: "" },
    //   ],
    // },
    {
      heading: "SERVICIO AL CLIENTE",
      links: [
        { name: "Contáctanos", link: "/clientWhatsApp" },
        { name: "Formulario de PQRS", link: "/pqrs" },
      ],
    },
    {
      heading: "CATEGORÍAS POPULARES",
      links: [
        // { name: "Accesorios para Vehículos", link: "" },
        // { name: "Agro", link: "" },
        {
          name: "Arte, Papelería y Manualidades",
          link: "/browse?category=66b683a4c2bd5f4688ba3e5d",
        },
        // { name: "Alimentos y  Bebidas", link: "" },
        { name: "Moda", link: "/browse?category=66b683b6c2bd5f4688ba3e67" },
        { name: "Bebés", link: "/browse?category=66b683bfc2bd5f4688ba3e6c" },
        {
          name: "Belleza y Cuidado Personal",
          link: "/browse?category=66b683c5c2bd5f4688ba3e71",
        },
        {
          name: "Tecnología",
          link: "/browse?category=66b683eec2bd5f4688ba3e89",
        },
        {
          name: "Electrodomésticos",
          link: "/browse?category=66b92b71390d09edc19129eb",
        },
        {
          name: "Ferretería",
          link: "/browse?category=66b683fcc2bd5f4688ba3e93",
        },
        // { name: "Agro", link: "" },
        // { name: "Arte, Papeleria y Manualidades", link: "" },
        // { name: "Accesorios para Vehículos", link: "" },
        // { name: "Agro", link: "" },
        // { name: "Arte, Papeleria y Manualidades", link: "" },
        // { name: "Accesorios para Vehículos", link: "" },
        // { name: "Agro", link: "" },
        // { name: "Arte, Papeleria y Manualidades", link: "" },
      ],
    },
  ];

  return (
    <div className={styles.footer__links}>
      {links?.map((link, i) => (
        <ul key={i}>
          <b>{link.heading}</b>
          {link.links.map((subLink, j) => (
            <li key={j}>
              <Link href={subLink.link} prefetch={true}>
                {subLink.name}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
