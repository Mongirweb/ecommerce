import { ErrorMessage, useField } from "formik";
import { useState } from "react";
import styles from "./styles.module.scss";
import { TbArrowUpRightCircle } from "react-icons/tb";
import Image from "next/image";

export default function Colors({ product, setProduct, name, ...props }) {
  const [toggle, setToggle] = useState(false);
  const [field, meta] = useField(props);

  // Predefined colors
  const predefinedColors = [
    { name: "Blanco", color: "#FFFFFF" },
    { name: "Negro", color: "#000000" },
    { name: "Gris", color: "#808080" },
    { name: "Café", color: "#6F4E37" },
    { name: "Beige", color: "#F5F5DC" },
    { name: "Naranja", color: "#FFA500" },
    { name: "Amarillo", color: "#FFFF00" },
    { name: "Verde Oscuro", color: "#006400" },
    { name: "Verde Claro", color: "#90EE90" },
    { name: "Azul Claro", color: "#ADD8E6" },
    { name: "Azul Oscuro", color: "#00008B" },
    { name: "Vino Tinto", color: "#8B0000" },
    { name: "Morado", color: "#800080" },
    { name: "Rosado", color: "#FFC0CB" },
    { name: "Plateado", color: "#C0C0C0" },
    { name: "Dorado", color: "#FFD700" },
    { name: "Rojo", color: "#FF0000" }, // Add red
    {
      name: "Multicolor",
      color:
        "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
    },
  ];

  // Render the swatches for the predefined colors
  const renderSwatches = () => {
    return predefinedColors.map((colorObj, id) => (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          key={id}
        >
          <div
            className={styles.square__color}
            style={{
              background: colorObj.color,
              backgroundColor: colorObj.color.includes("gradient")
                ? "none"
                : colorObj.color,
            }}
            onClick={() => {
              setProduct({
                ...product,
                color: { color: colorObj.color, image: product.color.image },
              });
              setToggle(true);
            }}
          ></div>
          {colorObj.name}
        </div>
      </>
    ));
  };

  return (
    <div className={styles.colors}>
      <div
        className={`${styles.header} ${
          meta.error[name] ? styles.header__error : ""
        }`}
      >
        <div className={styles.flex}>
          {meta.error[name] && (
            <Image
              width={100}
              height={100}
              src="/images/warning.png"
              alt="error"
              loading="lazy"
            />
          )}
          *Escoge el color del producto
        </div>
        <span>
          {meta.touched && meta.error && (
            <div className={styles.error__msg}>
              <span></span>
              <ErrorMessage name={name} />
            </div>
          )}
        </span>
      </div>
      <input
        type="text"
        value={product?.color?.color}
        name={name}
        hidden
        {...field}
        {...props}
      />
      <div className={styles.colors__infos}></div>
      <div className={toggle ? styles.toggle : ""}>
        <div className={styles.wheel}>{renderSwatches()}</div>
      </div>
      {predefinedColors.length > 0 && (
        <TbArrowUpRightCircle
          className={styles.toggle__btn}
          onClick={() => setToggle((prev) => !prev)}
          style={{ transform: `${toggle ? "rotate(180deg)" : ""}` }}
        />
      )}
    </div>
  );
}
