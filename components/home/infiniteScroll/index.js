"use client";
import React, { useRef, useEffect, memo } from "react";
import { useMediaQuery } from "react-responsive"; // ⬅️  NEW
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "./styles.module.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useResizeObserver from "@react-hook/resize-observer";
import { Loader } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Baby } from "lucide-react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const InfiniteCard = dynamic(() => import("./Card"), {
  ssr: false,
});

function useColumns() {
  const ref = useRef(null);
  const [cols, setCols] = React.useState(2); // sensible default

  useResizeObserver(ref, (entry) => {
    const width = entry.contentRect.width;

    /* pick a minimum card width depending on viewport */
    const cardMin =
      width >= 1280
        ? 220 // desktop XL → 5‑6 cols
        : width >= 1024
        ? 200 // desktop / laptop → 4‑5 cols
        : width >= 640
        ? 180 // tablet → 3‑4 cols
        : 150; // phone → 2 cols

    setCols(Math.max(1, Math.floor(width / cardMin)));
  });

  return [ref, cols];
}

const ROW_GAP = 40;

export default function InfiniteScrollVirtual({
  products,
  fetchMoreProducts,
  hasMore,
  isLoading,
  autoFetchEnabled,
  onClickVerMas,
}) {
  /* 1️⃣  How many columns on this screen? */
  const [parentRef, columns] = useColumns();

  /* 2️⃣  One virtual row = N cards                */
  const totalRows =
    Math.ceil(products.length / columns) +
    (hasMore && autoFetchEnabled ? 1 : 0);

  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 330 + ROW_GAP, // ≈ height of a card
    overscan: 6,
  });

  useEffect(() => {
    rowVirtualizer.measure(); // v3 API
  }, [columns, rowVirtualizer]);

  const { ref: sentinelRef, inView: infiniteInView } = useInView({
    rootMargin: "200px",
    threshold: 1,
  });

  useEffect(() => {
    if (infiniteInView && !isLoading && hasMore && autoFetchEnabled) {
      fetchMoreProducts();
    }
  }, [infiniteInView]);

  return (
    <div className={styles.wrapper} ref={parentRef}>
      <div className={styles.header}>
        Todo para tu bebé <Baby />
      </div>

      {/* ───────────  Virtualised grid  ─────────── */}
      <div className={styles.scroller}>
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vRow) => {
            const firstIndex = vRow.index * columns;
            const rowProducts = products.slice(
              firstIndex,
              firstIndex + columns
            );
            const isLoaderRow =
              autoFetchEnabled && firstIndex >= products.length;

            return (
              <VirtualRow key={vRow.index} start={vRow.start} size={vRow.size}>
                {isLoaderRow ? (
                  <div
                    ref={sentinelRef}
                    className={styles.loaderRow}
                    style={{
                      overflow: "hidden",
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    }}
                  >
                    {hasMore ? (
                      <div
                        className={styles.rowGrid}
                        style={{
                          gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        }}
                      >
                        {[...Array(10)].map((_, i) => (
                          <div key={i}>
                            <Skeleton
                              height={200}
                              width={190}
                              borderRadius={8}
                              style={{ margin: "10px" }}
                            />
                            <Skeleton
                              width="80%"
                              style={{ marginTop: "10px" }}
                            />
                            <Skeleton width="60%" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No hay más productos"
                    )}
                  </div>
                ) : (
                  <div
                    className={styles.rowGrid}
                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                  >
                    {rowProducts.map((p, idx) => (
                      <InfiniteCard
                        key={p._id ?? p.slug ?? `${firstIndex + idx}`}
                        product={p}
                        priority={vRow.index === 0}
                      />
                    ))}
                  </div>
                )}
              </VirtualRow>
            );
          })}
        </div>
      </div>

      {/* loaders / “ver más” identical to your original code … */}
      {isLoading && (
        <div className={styles.loader}>
          <Loader /> Cargando…
        </div>
      )}

      {hasMore && !autoFetchEnabled && (
        <div className={styles.seeMore}>
          <button onClick={onClickVerMas} disabled={isLoading}>
            <ChevronDown /> {isLoading ? "Cargando…" : "Ver más…"}
          </button>
        </div>
      )}

      {!hasMore && !isLoading && (
        <div className={styles.noMore}>No hay más productos para mostrar.</div>
      )}
    </div>
  );
}

/* 4️⃣  Absolute‑positioned virtual row */
const VirtualRow = memo(function VirtualRow({ start, size, children }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: size,
        paddingBottom: ROW_GAP,
        transform: `translateY(${start}px)`,
        display: "flex", // keep inline‑block children aligned
        alignItems: "stretch",
      }}
    >
      {children ?? <Skeleton height={300} borderRadius={8} />}
    </div>
  );
});
