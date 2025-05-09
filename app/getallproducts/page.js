// "use client";
// import React, { useEffect, useState } from "react";
// import { getAllProducts } from "../../utils/shopifyImport";

// export default function GetAllProducts() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchAll() {
//       try {
//         const all = await getAllProducts();
//         setProducts(all);
//         console.log("Fetched total products:", all.length);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     }

//     fetchAll();
//   }, []);

//   console.log(products);
//   const SHIPPING_PHRASE =
//     "INCLUYE ENVÍO GRATIS A TODA COLOMBIA Y CERTIFICADO DE GARANTÍA";

//   // si solo quieres quitarla, usa esta función
//   const stripShippingPhrase = (text) =>
//     text
//       .replace(new RegExp(SHIPPING_PHRASE, "gi"), "") // elimina la frase (may/min)
//       .replace(/\s{2,}/g, " ") // colapsa espacios dobles
//       .trim(); // quita espacios iniciales/finales

//   return (
//     <div>
//       <h1>All Products ({products.length})</h1>
//       {products.map((product) => (
//         <div key={product.id} style={{ margin: "1rem 0" }}>
//           <h2>{product.title}</h2>
//           <p>{stripShippingPhrase(product.description)}</p>
//           <p>Vendor: {product.vendor}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// "use client";
// import React, { useEffect, useState } from "react";

// export default function GetAllProducts() {
//   const [products, setProducts] = useState([]);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/api/shopify-import", {
//           method: "POST",
//           cache: "no-store",
//         });
//         const data = await res.json();
//         console.log(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return <div></div>;
// }

// "use client";
// import React, { useEffect, useState } from "react";
// import { fetchWooCommerceProducts } from "../../utils/fetchWoo";

// export default function GetAllProducts() {
//   const [products, setProducts] = useState([]);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         fetchWooCommerceProducts().then((data) => {
//           console.log(data);
//           setProducts(data);
//         });
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return <div></div>;
// }
