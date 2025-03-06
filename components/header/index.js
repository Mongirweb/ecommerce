"use client";
import Ad from "./Ad";
import Main from "./Main";
import styles from "./header.module.scss";
import Top from "./Top";

export default function Header({ country, searchHandler, searchParams }) {
  return (
    <header className={styles.header}>
      <div style={{ display: "none" }}>
        <h1>
          Somos el Hueco | Compra a Precio del Hueco de Medellín con Envío
          Gratis
        </h1>
        <h2>
          Encuentra los Mejores Productos del Hueco de Medellin sin Salir de
          Casa | Compra en línea
        </h2>
        <h3>
          Antojate de todo lo que quieras del Hueco, que en Somoselhueco te lo
          llevas a casa
        </h3>
        <p>
          En somoselhueco.com, traemos el auténtico precio del Hueco de Medellín
          directamente a tu puerta. Explora miles de productos ofrecidos por las
          mejores empresas del Hueco. Somos el Hueco
        </p>
      </div>
      <Ad />
      <Top country={country} />
      <Main searchHandler={searchHandler} searchParams={searchParams} />
    </header>
  );
}
