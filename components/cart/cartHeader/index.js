import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { compareArrays } from "../../../utils/arrays_utils";
import { useSession } from "next-auth/react";

export default function CartHeader({ cartItems, selected, setSelected }) {
  const [active, setActive] = useState();
  const { data: session } = useSession();

  const handleSelect = () => {
    if (selected.length < cartItems.length) {
      setSelected(cartItems);
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    const check = compareArrays(cartItems, selected);
    setActive(check);
  }, [selected, cartItems]);

  return (
    <div className={`${styles.cart__header} ${styles.card}`}>
      {session && <h2>Hola {session.user.name}</h2>}

      <h1>
        Total Carrito {""}({cartItems?.length})
      </h1>
      {/* <div className={styles.flex} onClick={() => handleSelect()}>
        <div
          className={`${styles.checkbox} ${active ? styles.active : ""}`}
        ></div>
      </div> */}
    </div>
  );
}
