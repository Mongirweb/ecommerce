// components/skeletons/MainSwiperSkeleton.jsx
import React from "react";
import styles from "./MainSwiperSkeleton.module.scss"; // Create corresponding CSS

export default function MainSwiperSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.shimmer} />
    </div>
  );
}
