"use client";

import { useEffect, useState } from "react";
import styles from "../../../../../styles/products.module.scss";
import ProductCard from "../../../../../components/admin/products/productCard";
import SingularSelect from "../../../../../components/selects/SingularSelect";
import { Form, Formik } from "formik";

const PAGE_SIZE = 25; // match your API default "limit=25"

export default function ProductsClient({ companyId, companies }) {
  const [myProducts, setMyProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allCompanies, setAllCompanies] = useState(companies || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Search -----
  const [query, setQuery] = useState("");
  const [querySku, setQuerySku] = useState("");
  const [queryCompany, setQueryCompany] = useState("");
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
  // 2) Search Handlers
  // ---------------------------
  const handleSearchProd = async () => {
    if (query.length < 2) return;
    setLoading(true);
    setError(null);
    setQuerySku("");
    setQueryCompany("");
    try {
      const res = await fetch(
        `/api/admin/searchProduct?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        throw new Error(`Error searching: ${res.statusText}`);
      }
      const data = await res.json();
      setSearching(true);
      setMyProducts(data.products || []);
      setTotalPages(1);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Error searching. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSku = async () => {
    if (querySku.length < 2) return;
    setLoading(true);
    setError(null);
    setQuery("");
    setQueryCompany("");
    try {
      const res = await fetch(
        `/api/admin/searchProductBySku?query=${encodeURIComponent(querySku)}`
      );
      if (!res.ok) {
        throw new Error(`Error searching: ${res.statusText}`);
      }
      const data = await res.json();
      setSearching(true);
      setMyProducts(data.products || []);
      setTotalPages(1);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Error searching. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Modified: accept companyId as parameter
  const handleSearchCompany = async (selectedCompany) => {
    if (!selectedCompany || selectedCompany.length < 2) return;
    setLoading(true);
    setError(null);
    setQuery("");
    setQuerySku("");

    try {
      const res = await fetch(
        `/api/admin/searchProductsByCompany?query=${encodeURIComponent(
          selectedCompany
        )}&page=${currentPage}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) {
        throw new Error(`Error searching: ${res.statusText}`);
      }
      const data = await res.json();

      if (data.products) {
        setMyProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        setMyProducts([]);
        setTotalPages(1);
      }
      setSearching(true);
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
    setQuerySku("");
    setQueryCompany("");
    setSearching(false);
    setCurrentPage(1);
  };

  // ---------------------------
  // 4) On Mount & Page changes
  // ---------------------------
  useEffect(() => {
    if (queryCompany) {
      handleSearchCompany(queryCompany);
    } else if (!searching) {
      fetchProducts(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, queryCompany, searching]);

  useEffect(() => {
    window.scrollTo(0, 0);
    function handlePageShow(e) {
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

      {/* Search Bars */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Buscar producto por nombre"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchProd()}
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
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Buscar producto por SKU"
          value={querySku}
          onChange={(e) => setQuerySku(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSku()}
        />
        {querySku && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearQuery}
          >
            X
          </button>
        )}
      </div>

      {/* Company Select */}
      <div className={styles.search}>
        <select
          placeholder="Buscar productos por empresa"
          value={queryCompany}
          onChange={(e) => {
            const selectedCompany = e.target.value;
            setQueryCompany(selectedCompany);
            // Immediately execute search when an option is selected.
            if (selectedCompany) {
              handleSearchCompany(selectedCompany);
            }
          }}
        >
          <option value="">Selecciona una empresa</option>
          {allCompanies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
        {queryCompany && (
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
      {(!searching || queryCompany) && (
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
