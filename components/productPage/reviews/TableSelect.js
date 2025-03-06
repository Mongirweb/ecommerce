import styles from "./styles.module.scss";
import { IoArrowDown } from "react-icons/io5";
import { useState } from "react";

export default function TableSelect({ property, text, data, handleChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.select}>
      {text}:
      <div
        className={styles.select__header}
        onMouseOver={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          background:
            text === "Estilo" && property?.color ? property.color : "",
        }}
      >
        <span
          className={`${styles.flex} ${styles.select__header_wrap}`}
          style={{
            padding: "0 5px",
          }}
        >
          {text === "Valoración" || text === "Tamaño" || text === "Ordenar" ? (
            property || `Selecciona`
          ) : text === "Estilo" && property?.image ? (
            <img
              src={property?.image}
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
            />
          ) : (
            "Selecciona Estilo"
          )}
          <IoArrowDown />
        </span>
        {visible && (
          <ul
            className={styles.select__header_menu}
            onMouseOver={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            style={{ width: text === "Ordenar" ? "200px" : "auto" }}
          >
            {data.map((item, i) => {
              if (text === "Valoración") {
                return (
                  <li key={i} onClick={() => handleChange(item.value)}>
                    <span>{item.text}</span>
                  </li>
                );
              }
              if (text === "Tamaño") {
                return (
                  <li key={i} onClick={() => handleChange(item.size)}>
                    <span>{item.size}</span>
                  </li>
                );
              }
              if (text === "Estilo") {
                return (
                  <li
                    key={i}
                    onClick={() => handleChange(item)}
                    style={{ backgroundColor: item.color }}
                  >
                    <span>
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        "Todos los estilos"
                      )}
                    </span>
                  </li>
                );
              }
              if (text === "Ordenar") {
                return (
                  <li
                    style={{ width: "200px" }}
                    key={i}
                    onClick={() => handleChange(item.value)}
                  >
                    <span>{item.text}</span>
                  </li>
                );
              }
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
