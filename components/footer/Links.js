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
          name: "Primer día",
          link: "/browse?category=67d3450902d26a8677f2e260",
        },
        // { name: "Alimentos y  Bebidas", link: "" },
        {
          name: "Ropa bebé",
          link: "/browse?category=67d344eb02d26a8677f2e228",
        },
        { name: "Calzado", link: "/browse?category=67d344f302d26a8677f2e236" },
        {
          name: "Accesorios",
          link: "/browse?category=67d344fa02d26a8677f2e244",
        },
        {
          name: "Cuidado",
          link: "/browse?category=67d3450102d26a8677f2e252",
        },
        {
          name: "Trajes de baño",
          link: "/browse?category=67d432cfcbc95777ceb121b0",
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
