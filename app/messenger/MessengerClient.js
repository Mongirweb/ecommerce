"use client";
import React, { useEffect } from "react";
import styles from "../../styles/messenger.module.scss";
import Header from "../../components/messenger/header";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const revalidate = 0; // Revalidate on every request
// Add this at the top of the file
export const dynamic = "force-dynamic";

export default function MessengerClient({ session, orders, user }) {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);
  const handleStartCollecting = async (orderId) => {
    try {
      const { data } = await axios.post(
        "/api/messenger/messengerStartCollecting",
        {
          orderId,
        }
      );
      if (data.message === "Order updated successfully.") {
        router.push(`/messenger/${orderId}`);
      } else {
        toast.error("Orden no actualizada");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles.messengerContainer} style={{ height: "100vh" }}>
      <Header />
      <div className={styles.header}>
        <Image
          src={session.user.image}
          alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
          width={80}
          height={80}
        />
        <h2>{session.user.name}</h2>
        <span>Opciones:</span>
        <div className={styles.options}>
          <button>Pedidos Enviados: {user?.deliveredOrders?.length}</button>
        </div>
      </div>
      {/* Orders Section */}
      <div className={styles.ordersContainer}>
        {orders?.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <h3>Pedido ID: {order._id}</h3>
            <p>Guía ID: {order?.trackingInfo?.trackingNumber || "N/A"}</p>
            <p>
              Estado:{" "}
              <span
                className={
                  order.status === "Abierto" ? styles.open : styles.closed
                }
              >
                {order.messengerStatus}
              </span>
            </p>
            <p>Cantidad Productos: {order.products.length}</p>

            <div className={styles.productCard}>
              <button
                className={styles.markCollected}
                onClick={() => {
                  handleStartCollecting(order._id);
                }}
              >
                Empezar a recoger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
