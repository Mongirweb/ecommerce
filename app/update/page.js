// components/ExcelUploader.js
"use client";

import Image from "next/image";
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function ExcelUploader({ onComplete }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  /* ──────────────── parseo ──────────────── */
  async function handleParse() {
    if (!file) return;
    setStatus("parsing");
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const headers = json[0] ?? [];
      const idx = (c) => headers.indexOf(c);

      const skuIdx = idx("Sku");
      const parentIdx = idx("Parent product sku");
      const nameIdx = idx("Product Name");
      const priceIdx = idx("Product Price");
      const sizeIdx = idx("sizes");
      const colorIdx = idx("colors");
      const tag0Idx = idx("Tag0");
      const tag1Idx = idx("Tag1");
      const AltoIdx = idx("ALTO");
      const AnchoIdx = idx("ANCHO");
      const LargoIdx = idx("LARGO");
      const PesoIdx = idx("Weight");
      const descriptionIdx = idx("Product Description");

      const imgCols = [
        idx("Product Image"),
        idx("Product Picture url"),
        idx("Picture0"),
        idx("Picture1"),
        idx("Picture2"),
        idx("Picture3"),
        idx("Picture4"),
        idx("Picture5"),
        idx("Picture6"),
        idx("Picture7"),
      ].filter((i) => i !== -1);

      if ([skuIdx, parentIdx, nameIdx].some((i) => i === -1)) {
        throw new Error(
          "Faltan columnas requeridas: 'Sku', 'Parent product sku' o 'Product Name'."
        );
      }

      const extracted = json.slice(1).map((row) => {
        const image =
          imgCols.map((i) => row[i]?.toString().trim()).find((url) => url) ||
          "";

        return {
          sku: row[skuIdx]?.toString() ?? "",
          parentSku: row[parentIdx]?.toString() ?? "",
          name: row[nameIdx]?.toString() ?? "",
          price: row[priceIdx] ?? "",
          size: row[sizeIdx]?.toString() ?? "",
          color: row[colorIdx]?.toString() ?? "",
          tag0: row[tag0Idx]?.toString() ?? "",
          tag1: row[tag1Idx]?.toString() ?? "",
          Alto: row[AltoIdx] ?? "",
          Ancho: row[AnchoIdx] ?? "",
          Largo: row[LargoIdx] ?? "",
          weight: row[PesoIdx] ?? "",
          description: row[descriptionIdx]?.toString() ?? "",
          image,
        };
      });

      setRows(extracted);
      onComplete?.(extracted);

      // ⬇️ Aquí se envía al backend
      await fetch("/api/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extracted),
      });

      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    }
  }

  /* ──────────────── agrupación ──────────────── */
  const products = useMemo(() => {
    const map = {};
    for (const r of rows) {
      const isParent = !r.parentSku;
      const key = isParent ? r.sku : r.parentSku;

      if (!map[key]) {
        map[key] = {
          sku: key,
          name: r.name,
          price: r.price,
          image: r.image,
          variants: [],
        };
      }

      if (isParent) {
        map[key].name = r.name || map[key].name;
        map[key].price = r.price || map[key].price;
        map[key].image = r.image || map[key].image;
      } else {
        map[key].variants.push({
          sku: r.sku,
          size: r.size,
          color: r.color,
          price: r.price,
          image: r.image,
        });
      }
    }
    return Object.values(map).sort((a, b) => a.sku.localeCompare(b.sku));
  }, [rows]);

  /* ──────────────── UI ──────────────── */
  return (
    <div className="space-y-6">
      {/* selector + botón */}
      <div className="space-y-3">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input file-input-bordered w-full max-w-sm"
        />
        <button
          type="button"
          onClick={handleParse}
          className="btn btn-primary"
          disabled={!file || status === "parsing"}
        >
          {status === "parsing" ? "Procesando…" : "Procesar archivo"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "done" && (
          <p className="text-sm text-green-600">
            ¡Archivo procesado correctamente!
          </p>
        )}
      </div>

      {/* listado de productos */}
      {products.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Productos ({products.length})
          </h2>

          <ul className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {products.map(
              (p, index) => (
                console.log(p),
                (
                  <li
                    key={p.sku + index}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name || p.sku}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-contain rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                          Sin imagen
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <p className="font-medium text-blue-700">{p.sku}</p>
                            {p.name && (
                              <p className="text-sm text-gray-700">{p.name}</p>
                            )}
                          </div>
                          {p.price && (
                            <span className="text-sm font-semibold">
                              ${Number(p.price).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* variantes */}
                        {p.variants.length > 0 ? (
                          <table className="table w-full mt-2">
                            <thead>
                              <tr className="text-xs text-gray-500">
                                <th></th>
                                <th>SKU</th>
                                <th>Talla</th>
                                <th>Color</th>
                                <th>Precio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.variants.map((v) => (
                                <tr key={v.sku} className="text-sm">
                                  <td className="w-16">
                                    {v.image ? (
                                      <Image
                                        width={48}
                                        height={48}
                                        src={v.image}
                                        alt={v.sku}
                                        className="w-12 h-12 object-contain"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td>{v.sku}</td>
                                  <td>{v.size || "-"}</td>
                                  <td>{v.color || "-"}</td>
                                  <td>
                                    {v.price
                                      ? `$${Number(v.price).toLocaleString()}`
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            Sin variantes registradas
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                )
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
