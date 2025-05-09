"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.scss"; // ⬅️  import the module

export const VerticalBenefitTicker = ({
  items,
  interval = 3500,
  compact = false,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const tRef = useRef(null);

  /* timer */
  useEffect(() => {
    tRef.current = setTimeout(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );
    return () => clearTimeout(tRef.current);
  }, [index, interval, items.length]);

  const current = items[index];

  /* markup */
  return (
    <div
      className={`${styles.benefitTicker} ${
        compact ? styles.compact : ""
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.benefitSlide}
        >
          <span className={styles.benefitIcon}>{current.icon}</span>

          <div className={styles.benefitText}>
            <p className={styles.benefitTitle}>{current.title}</p>

            {!compact && current.subtitle && (
              <p className={styles.benefitSubtitle}>{current.subtitle}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
