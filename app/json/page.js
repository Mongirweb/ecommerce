// app/somos/page.jsx

import Image from "next/image";
import { somos } from "../../data/somos"; // Adjust path as needed

export default function SomosPage() {
  return (
    <main style={{ padding: "1rem" }}>
      <h1>Listado de Productos {somos?.length}</h1>
      {somos?.map((item) => {
        // Convert string prices to numbers
        const p1 = Number(item.precio1);
        const p2 = Number(item.precio2);

        // Calculate % difference = ((p2 - p1) / p1) * 100
        const percentageDiff = ((p2 - p1) / (p1 || 1)) * 100;

        return (
          <div
            key={item.plu}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            {/* Main Product Image */}
            {item.imagen_url ? (
              <Image
                width={150}
                height={150}
                src={item.imagen_url}
                alt={item.nombre}
                style={{ width: "150px", marginBottom: "0.5rem" }}
              />
            ) : (
              <p>Sin imagen</p>
            )}

            {/* Main Product Info */}
            <h2>{item.nombre}</h2>
            <p>Categoría: {item.categoria}</p>
            <p>PLU: {item.plu}</p>
            <p>Precio 1: {p1}</p>
            <p>Precio 2: {p2}</p>
            <p>Porcentaje: {percentageDiff.toFixed(2)}%</p>

            {/* Variants Section */}
            {item.variantes?.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h3>Variantes:</h3>
                {item.variantes.map((variant, idx) => (
                  <div
                    key={variant.plu_variante || idx}
                    style={{
                      border: "1px dashed #999",
                      marginBottom: "0.5rem",
                      padding: "0.5rem",
                    }}
                  >
                    {/* Variant Image */}
                    {variant.imagen_variante ? (
                      <Image
                        width={80}
                        height={80}
                        src={variant.imagen_variante}
                        alt={variant.variante}
                        style={{ width: "80px", marginBottom: "0.25rem" }}
                      />
                    ) : (
                      <p>Sin imagen para la variante</p>
                    )}

                    <p>
                      <strong>Variante:</strong> {variant.variante}
                    </p>
                    <p>PLU variante: {variant.plu_variante}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}
