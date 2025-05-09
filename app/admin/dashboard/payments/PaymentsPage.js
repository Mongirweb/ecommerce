"use client";
import React from "react";

export default function PaymentsPage({ payments }) {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Pagos pendientes</h1>

      {payments.length === 0 ? (
        <p>No hay pagos por liquidar.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Empresa</th>
              <th className="py-2">Total a pagar (COP)</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(({ companyId, name, amount }) => (
              <tr key={companyId} className="border-b">
                <td className="py-2">{name}</td>
                <td className="py-2">
                  {amount.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
