import Link from "next/link";
import styles from "./header.module.scss";
import Router from "next/router";
import { signOut, signIn } from "next-auth/react";
import Image from "next/image";

export default function UserMenu({ session }) {
  const business = session?.user?.role === "business";

  return (
    <div className={styles.menu}>
      <h4>Bienvenido a Almacen Mongir!</h4>
      {session ? (
        <div className={styles.flex}>
          <Image
            width={300}
            height={300}
            src={session?.user?.image}
            alt="Mongir Logo"
            className={styles.menu__img}
            loading="lazy"
          />
          <div className={styles.col}>
            <span>Bienvenido,</span>
            <h3>{session?.user?.name}</h3>
            <span onClick={() => signOut()}>Cerrar sesión</span>
          </div>
        </div>
      ) : (
        <div className={styles.flex}>
          <button className={styles.btn_outlined} onClick={() => signIn()}>
            Iniciar sesión
          </button>
        </div>
      )}
      <ul>
        {business && (
          <li style={{ fontWeight: "bold" }}>
            <Link href="/business/dashboard" prefetch={true}>
              Dashboard Mi Negocio
            </Link>
          </li>
        )}

        <li>
          <Link href="/myprofile/profile?tab=0&q=mi-perfil" prefetch={true}>
            Mi Cuenta
          </Link>
        </li>
        <li>
          <Link href="/myprofile/orders" prefetch={true}>
            Mis Pedidos
          </Link>
        </li>

        {/* <li>
          <Link href="/myprofile/wishlist?tab=2&q=me-gusta" prefetch={true}>
            Mi lista de deseos
          </Link>
        </li> */}
      </ul>
    </div>
  );
}
