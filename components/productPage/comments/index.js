import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";

export default function Comments({ product }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  function hasHtmlTags(text = "") {
    return /<[a-z][\s\S]*>/i.test(text);
  }

  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      setIsOverflowing(true);
    }
  }, []);

  return (
    <div className={styles.comments}>
      <span className={styles.title}>Descripción</span>
      <div
        className={`${styles.descriptionContainer} ${
          expanded ? styles.expanded : ""
        }`}
        ref={contentRef}
      >
        {hasHtmlTags(product.description) ? (
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: product.description }}
            className={styles.descriptionContent}
          />
        ) : (
          <p ref={contentRef} className={styles.descriptionContent}>
            {product.description}
          </p>
        )}
        {!expanded && isOverflowing && <div className={styles.fadeOut} />}
      </div>

      {isOverflowing && (
        <button
          className={styles.showMore}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Ver menos" : "Ver descripción completa"}
        </button>
      )}
    </div>
  );
}
