import React from "react";
import styles from "./styles.module.scss";
import { warranty } from "../../../../data/warranty";
import { warrantyTime } from "../../../../data/warranty";

export default function Warranty({ warranty, product, setProduct }) {
  const handleWarranty = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // parseInt ensures we store a genuine number, not a string
    setProduct({ ...product, warranty: { [name]: parseInt(value, 10) } });
  };
  const preventScroll = (e) => {
    e.target.blur(); // Temporarily unfocus the input to prevent scroll.
  };
  return (
    <div>
      <div className={styles.header}>*Garantía </div>

      <div className={styles.clicktoadd}>
        <div className={styles.clicktoadd__inputs}>
          <input
            type="number"
            name="number"
            value={Number(warranty.number)}
            onChange={handleWarranty}
            onWheel={preventScroll}
            min={1}
            placeholder="Ej: 1"
            pattern="^(?:[1-9]|[1-2][0-9]|30)$"
          />

          <span>Mes y/o meses</span>
        </div>
      </div>
    </div>
  );
}
