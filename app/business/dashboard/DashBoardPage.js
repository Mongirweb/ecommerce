"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/business/layout";
import { SlHandbag, SlEye } from "react-icons/sl";
import Link from "next/link";
import styles from "../../../styles/dashboard.module.scss";
import Header from "../../../components/business/layout/header";
import CollapsibleTable from "../../../components/business/orders/table";

export default function DashBoardPage({ session, orders, products }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 620);
    };

    // Initial check
    handleResize();

    // Add event listener to detect window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isSmallScreen) {
    return (
      <>
        <Header />
        <div className={styles.mobileWarning}>
          <h1>Por favor accede a esta página desde tu PC o Laptop</h1>
          <p>
            Para una mejor experiencia, utiliza un dispositivo con mayor
            resolución como una computadora de escritorio o un laptop.
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <Layout>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.card__icon}>
              <SlHandbag />
            </div>
            <div className={styles.card__infos}>
              <h4>+{orders.length}</h4>
              <span>Pedidos</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.card__infos}>
              <h4>+{products.length}</h4>
              <span>Mis Productos</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.card__infos}>
              <h4>
                $
                {orders
                  .reduce((a, val) => a + val.total, 0)
                  .toLocaleString("es-CO")}
              </h4>
              <span>Total Ventas</span>
            </div>
          </div>
        </div>

        <CollapsibleTable rows={orders} />
      </Layout>
    </div>
  );
}
