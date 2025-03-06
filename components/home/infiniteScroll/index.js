"use client";
import React, { useEffect } from "react";
import styles from "./styles.module.scss"; // Ensure you create and style this file
import InfiniteCard from "./Card"; // Reuse the existing product card component
import Skeleton from "react-loading-skeleton";
import { FaSpinner } from "react-icons/fa";
import { BiCool } from "react-icons/bi";
import { FaArrowDown } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";

export default function InfiniteScroll({
  products,
  fetchMoreProducts,
  hasMore,
  isLoading,
  autoFetchEnabled,
  onClickVerMas,
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore && autoFetchEnabled) {
      fetchMoreProducts();
    }
  }, [inView, hasMore, autoFetchEnabled, fetchMoreProducts]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        Creemos que te puede gustar <BiCool />
      </div>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <InfiniteCard product={product} />
          </div>
        ))}

        {isLoading &&
          [...Array(10)].map((_, index) => (
            <div key={index} className={styles.productCard}>
              <Skeleton height={200} width="100%" borderRadius={8} />
              <Skeleton width="80%" style={{ marginTop: "10px" }} />
              <Skeleton width="60%" />
            </div>
          ))}
      </div>

      {/* Loader for automatic fetching */}
      {hasMore && autoFetchEnabled && (
        <div ref={ref} className={styles.loader}>
          <FaSpinner className={styles.spinner} />
          <p>Cargando más productos...</p>
        </div>
      )}

      {/* "Ver más" button after reaching the fetch limit */}
      {hasMore && !autoFetchEnabled && (
        <div className={styles.seeMore}>
          <button onClick={onClickVerMas} disabled={isLoading}>
            <FaArrowDown /> {isLoading ? "Cargando..." : "Ver más..."}
          </button>
        </div>
      )}

      {/* Message when no more products are available */}
      {!hasMore && (
        <div className={styles.noMore}>
          <p>No hay más productos para mostrar.</p>
        </div>
      )}
    </div>
  );
}
