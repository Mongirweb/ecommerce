import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
export default function Empty() {
  const { data: session } = useSession();

  return (
    <div className={styles.empty}>
      <img src="../../../images/empty.png" alt="" />
      <h1>El Carrito esta vacío</h1>
      {!session && (
        <button onClick={() => signIn()} className={styles.empty__btn}>
          Iniciar Sesión / Registrarme{" "}
        </button>
      )}
      <Link legacyBehavior href="/browse" prefetch={true}>
        <a>
          <button className={`${styles.empty__btn} ${styles.empty__btn_v2}`}>
            Comprar Ahora
          </button>
        </a>
      </Link>
    </div>
  );
}
