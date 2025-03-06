import { useState } from "react";
import styles from "./styles.module.scss";
import TableSelect from "./TableSelect";

export default function TableHeader({ reviews, allSizes, colors }) {
  const [rating, setRating] = useState();
  const [size, setSize] = useState();
  const [style, setStyle] = useState();
  const [order, setOrder] = useState();

  return (
    <div className={styles.table__header}>
      <TableSelect
        property={rating}
        text="Valoración"
        data={ratings.filter((x) => x.value !== rating)}
        handleChange={setRating}
      />
      {/* <TableSelect
        property={size}
        text="Tamaño"
        data={allSizes.filter((x) => x.size !== size)}
        handleChange={setSize}
      /> */}
      {/* <TableSelect
        property={style}
        text="Estilo"
        data={colors.filter((x) => x !== style)}
        handleChange={setStyle}
      /> */}
      <TableSelect
        property={order}
        text="Ordenar"
        data={orderOptions.filter((x) => x.value !== order)}
        handleChange={setOrder}
      />
    </div>
  );
}

const ratings = [
  {
    text: "Todas",
    value: "",
  },
  {
    text: "5 estrellas",
    value: 5,
  },
  {
    text: "4 estrellas",
    value: 4,
  },
  {
    text: "3 estrellas",
    value: 3,
  },
  {
    text: "2 estrellas",
    value: 2,
  },
  {
    text: "1 estrella",
    value: 1,
  },
];

const orderOptions = [
  {
    text: "Recomendado",
    value: "Recomendado",
  },
  {
    text: "Más recientes",
    value: "Mas recientes",
  },
  {
    text: "Más antiguos",
    value: "Mas antiguos",
  },
];
