// "use client";
// import React, { useEffect, useState } from "react";
// import { getProducts } from "../../utils/shopifyImport";

// export default function GetAllProducts() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     getProducts().then((data) => {
//       console.log(data.products.edges);
//       setProducts(data);
//     });
//   }, []);
//   return <div></div>;
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
