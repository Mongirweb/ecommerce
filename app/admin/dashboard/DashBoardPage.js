"use client";
import React from "react";
import Layout from "../../../components/admin/layout";
import { TbUsers } from "react-icons/tb";
import { SlHandbag, SlEye } from "react-icons/sl";
import { SiProducthunt } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import Link from "next/link";
import styles from "../../../styles/dashboard.module.scss";
import Dropdown from "../../../components/admin/dashboard/dropdown";
import Notifications from "../../../components/admin/dashboard/notifications";
import Image from "next/image";

export default function DashBoardPage({ session, orders, products }) {
  return (
    <div>
      <Layout>
        {/* <div className={styles.header}>
          <div className={styles.header__right}>
            <Dropdown userImage={session?.user?.image} />
            <Notifications />
          </div>
        </div> */}
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
            <div className={styles.card__icon}>
              <SiProducthunt />
            </div>
            <div className={styles.card__infos}>
              <h4>+{products.length}</h4>
              <span>Productos Listados</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.card__icon}>
              <GiTakeMyMoney />
            </div>
            <div className={styles.card__infos}>
              <h4>
                +$
                {orders
                  .reduce((a, val) => a + val.total, 0)
                  .toLocaleString("es-CO")}
              </h4>

              <h5>
                -$
                {orders
                  .filter((o) => !o.isPaid)
                  .reduce((a, val) => a + val.total, 0)
                  .toLocaleString("es-CO")}{" "}
                no procesadas
              </h5>
              <span>Total Ventas</span>
            </div>
          </div>
        </div>
        <div className={styles.data}>
          <div className={styles.orders}>
            <div className={styles.heading}>
              <h2>Pedidos Recientes</h2>
              <Link href="/admin/dashboard/orders">Ver Todo</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <td>Nombre</td>
                  <td>Total</td>
                  <td>Pago</td>
                  <td>Estado</td>
                  <td>Ver</td>
                </tr>
              </thead>
              <tbody>
                {orders.map(
                  (order, i) => (
                    console.log(order),
                    (
                      <tr key={i}>
                        <td>{order?.user?.name}</td>
                        <td>${order.total.toLocaleString("es-CO")}</td>
                        <td>
                          {order.isPaid ? <p>Pagado</p> : <p>No Pagado</p>}
                        </td>
                        <td>
                          <div
                            className={`${styles.status} ${
                              order?.status === "Not Processed"
                                ? styles.not_processed
                                : order.status === "Processing"
                                ? styles.processing
                                : order.status === "Dispatched"
                                ? styles.dispatched
                                : order.status === "Cancelled"
                                ? styles.cancelled
                                : order.status === "Completed"
                                ? styles.completed
                                : ""
                            }`}
                          >
                            {order.status}
                          </div>
                        </td>
                        <td>
                          <Link href={`/order/${order._id}`}>
                            <SlEye />
                          </Link>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
  );
}
