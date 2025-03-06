"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
// Example of using any layout component you already have
import Layout from "../../../../components/business/layout";
import styles from "../../../../styles/sales.module.scss"; // if you want to add specific styles
import Link from "next/link";

export default function SalesPage({
  chartData,
  moneyRequested,
  moneyAvailable,
}) {
  return (
    <Layout>
      {/* Title/Heading */}
      <div className={styles.salesHeader}>
        <h1>Ventas</h1>
      </div>

      {/* Cards to show money requested, amount available */}
      {/* <div className={styles.cards}>
        <div className={styles.card}>
          <h3>${moneyRequested.toLocaleString("es-CO")}</h3>
          <span>Solicitado para pago</span>
          <Link href="/business/dashboard/paymentHistory">
            Ver historial de pagos
          </Link>
        </div>
        <div className={styles.card}>
          <h3>${moneyAvailable.toLocaleString("es-CO")}</h3>
          <span>Monto disponible</span>
          <Link href="/business/dashboard/paymentRequest">
            Solicitar desembolso
          </Link>
        </div>
      </div> */}

      {/* Sales Chart */}
      <div className={styles.chartContainer}>
        <BarChart width={800} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
    </Layout>
  );
}
