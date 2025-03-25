// app/profile/orders/OrdersClient.js
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../../../styles/profile.module.scss";
import { FiExternalLink } from "react-icons/fi";
import slugify from "slugify";
import Image from "next/image";
import Layout from "../../../components/profile/layout";

export default function OrdersClient({ session, tab, orders, ordersLinks }) {
  const searchParams = useSearchParams();
  const formatPrice = (price) => new Intl.NumberFormat("de-DE").format(price);

  return (
    <Layout session={session} tab={tab}>
      <Head>
        <title>Orders</title>
      </Head>
      <div className={styles.orders}>
        <div className={styles.header}>
          <h1>Mis Pedidos</h1>
        </div>
        {/* <nav>
          <ul>
            {ordersLinks?.map((link, i) => (
              <li
                key={i}
                className={
                  slugify(link?.name, { lower: true }) ===
                  searchParams.get("q")?.split("__")[0]
                    ? styles.active
                    : ""
                }
              >
                <Link
                  href={`/profile/orders?tab=${tab}&q=${slugify(link.name, {
                    lower: true,
                  })}__${link.filter}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav> */}
        <table>
          <thead>
            <tr>
              <td>ID pedido</td>
              <td>Productos</td>
              <td>Metodo de Pago</td>
              <td>Total</td>
              <td>Pagado</td>
              <td>Status</td>
              <td>Ver </td>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, i) => (
              <tr key={i}>
                <td>{order._id}</td>
                <td className={styles.orders__images}>
                  {order.products.map((p) => (
                    <Image
                      src={p.image}
                      key={p._id}
                      alt="Mongir Logo"
                      width={50}
                      height={50}
                      loading="lazy"
                    />
                  ))}
                </td>
                <td>
                  {order.paymentMethod === "CARD"
                    ? "Tarjeta"
                    : order.paymentMethod}
                </td>
                <td>${formatPrice(order.total)}</td>
                <td className={styles.orders__paid}>
                  {order.isPaid ? (
                    <Image
                      src="/images/verified.png"
                      alt="Paid"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      src="/images/unverified.png"
                      alt="Unpaid"
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  <Link href={`/orderClient/${order._id}`} prefetch={true}>
                    <FiExternalLink />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
