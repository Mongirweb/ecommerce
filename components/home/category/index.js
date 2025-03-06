import React, { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import styles from "./category.module.scss";
import { useMediaQuery } from "react-responsive";

import CategoryProductCard from "../../categoryProductCard";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Category({ header, products, background, categories }) {
  const [category, setCategory] = useState(null);
  const isMedium = useMediaQuery({ query: "(max-width:1300px)" });
  const isMobile = useMediaQuery({ query: "(max-width:550px)" });
  const isLoading = !products || products.length === 0 || !categories;

  useEffect(() => {
    const matchedCategory = categories.find((cat) => cat.name === header);
    if (matchedCategory) {
      setCategory(matchedCategory); // Set the category ID
    }
  }, [categories, header]);

  return (
    <div className={styles.category} style={{ background: `${background}` }}>
      <div className={styles.category__header}>
        <Link
          href={{
            pathname: `${category?.link}`,
            query: { category: category?.id },
          }}
          prefetch={true}
        >
          <h1>{header}</h1>
          <BsArrowRightCircle />
        </Link>
      </div>

      <div className={styles.category__products}>
        {isLoading
          ? [...Array(isMobile ? 6 : isMedium ? 4 : 6)].map((_, i) => (
              <div key={i} className={styles.skeletonWrapper}>
                <Skeleton height={200} width="100%" borderRadius={8} />
                <Skeleton width="80%" style={{ marginTop: "10px" }} />
                <Skeleton width="60%" />
              </div>
            ))
          : products
              .slice(0, isMobile ? 6 : isMedium ? 4 : 6)
              .map((product, i) => (
                <CategoryProductCard key={i} product={product} />
              ))}
      </div>

      <div className={styles.category__see_all}>
        <Link
          href={{
            pathname: `${category?.link}`,
            query: { category: category?.id },
          }}
          prefetch={true}
        >
          <button>Ver todo</button>
        </Link>
      </div>
    </div>
  );
}
