import { useState } from "react";
import { BsFillPatchMinusFill, BsFillPatchPlusFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { sizesList } from "../../../../data/sizes";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./styles.module.scss";

export default function Details({ details, product, setProduct }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDetails = (i, e) => {
    const values = [...details];
    values[i][e.target.name] = e.target.value;
    setProduct({ ...product, details: values });
  };
  const handleRemove = (i) => {
    if (details.length > 1) {
      const values = [...details];
      values.splice(i, 1);
      setProduct({ ...product, details: values });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        Detalles del producto{" "}
        <FaInfoCircle
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        {showTooltip && (
          <div className={styles.tooltip}>
            Llena los detalles del producto con un detalle y un valor. Ejemplo:
            <br />
            Peso - 1kg, largo: 1mt, ancho: 2mt, alto: 2mt, voltios: 120v, color:
            <br />
            blanco, Ej: Tela: algodon, talla: s, medidas etc... lo anterior{" "}
            <br />
            sirve para describir el producto a vender.
            <br />
            Porfavor agrega todos los detalles necesarios para que el usuario
            <br />
            pueda informarse lo mejor posible.
          </div>
        )}
      </div>
      {details.length == 0 && (
        <BsFillPatchPlusFill
          className={styles.svg}
          onClick={() => {
            setProduct({
              ...product,
              details: [
                ...details,
                {
                  name: "",
                  value: "",
                },
              ],
            });
          }}
        />
      )}
      {details
        ? details.map((detail, i) => (
            <div className={styles.clicktoadd} key={i}>
              <input
                type="text"
                name="name"
                placeholder="detalle"
                value={detail.name}
                onChange={(e) => handleDetails(i, e)}
              />
              <input
                type="text"
                name="value"
                placeholder="valor"
                value={detail.value}
                onChange={(e) => handleDetails(i, e)}
              />

              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <CiCircleMinus onClick={() => handleRemove(i)} />
                  <span>Eliminar Detalle</span>
                </div>
              </>
            </div>
          ))
        : ""}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
        }}
        className={styles.adddetail}
      >
        <CiCirclePlus
          onClick={() => {
            setProduct({
              ...product,
              details: [
                ...details,
                {
                  name: "",
                  value: "",
                },
              ],
            });
          }}
        />
        <span>Agregar Detalle</span>
      </div>
    </div>
  );
}
