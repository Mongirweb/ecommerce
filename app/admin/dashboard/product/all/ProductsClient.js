"use client";

import { useEffect, useState } from "react";
import styles from "../../../../../styles/products.module.scss";
import ProductCard from "../../../../../components/admin/products/productCard";

const PAGE_SIZE = 25; // match your API default "limit=6"

export default function ProductsClient({ companyId }) {
  const [myProducts, setMyProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Search -----
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // ---------------------------
  // 1) Fetch Products (paginated)
  // ---------------------------
  const fetchProducts = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/allProducts?page=${page}&limit=${PAGE_SIZE}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching page ${page}: ${response.statusText}`);
      }
      const data = await response.json();
      // Expecting: { products: [...], totalPages: N }

      if (data.products) {
        setMyProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        setMyProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 2) Search Handler
  // ---------------------------
  const handleSearchProd = async () => {
    if (query.length < 2) return; // optional guard
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/searchProduct?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        throw new Error(`Error searching: ${res.statusText}`);
      }
      const data = await res.json();
      setSearching(true);
      if (data.products) {
        setMyProducts(data.products);
      } else {
        setMyProducts([]);
      }
      setTotalPages(1); // For simplicity, no pagination on search results
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Error searching. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 3) Clear Search
  // ---------------------------
  const handleClearQuery = () => {
    setQuery("");
    setSearching(false);
    // Reset to page 1 of normal products
    setCurrentPage(1);
  };

  // ---------------------------
  // 4) On Mount & Page changes
  // ---------------------------
  useEffect(() => {
    if (!searching) {
      fetchProducts(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searching]);

  // If you want searching to be triggered on Enter press only,
  // then you don’t need to re-fetch on query change automatically.

  // If you want to automatically re-fetch as user types, remove the Enter key logic
  // and call handleSearchProd inside onChange. But you might also want to throttle it.

  useEffect(() => {
    // Scroll to top on initial mount
    window.scrollTo(0, 0);

    // Also handle 'pageshow' event for bfcache
    function handlePageShow(e) {
      // e.persisted indicates bfcache was used
      if (e.persisted) {
        window.scrollTo(0, 0);
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [currentPage]);

  // ---------------------------
  // 5) Render
  // ---------------------------
  return (
    <>
      <div className={styles.header}>Todos los productos</div>

      {/* Search Bar */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Buscar producto por nombre"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchProd();
            }
          }}
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearQuery}
          >
            X
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))
        ) : (
          <div>No hay productos para mostrar.</div>
        )}
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Pagination: only show if not searching */}
      {!searching && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <div className={styles.loader}>Cargando...</div>}
    </>
  );
}
