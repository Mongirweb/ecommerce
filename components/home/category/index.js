import React, { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import styles from "./category.module.scss";
import { useMediaQuery } from "react-responsive";
import { IoIosArrowForward } from "react-icons/io";
import CategoryProductCard from "../../categoryProductCard";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Category({ header, products, background, categories }) {
  const [category, setCategory] = useState(null);
  const isMedium = useMediaQuery({ query: "(max-width:1300px)" });
  const isMobile = useMediaQuery({ query: "(max-width:550px)" });
  const query400px = useMediaQuery({ query: "(max-width:400px)" });
  const isLoading = !products || products.length === 0 || !categories;
  const router = useRouter();

  useEffect(() => {
    const matchedCategory = categories.find((cat) => cat.name === header);
    if (matchedCategory) {
      setCategory(matchedCategory); // Set the category ID
    }
  }, [categories, header]);

  const handleOpenCategory = () => {
    router.push(`browse?category=${category?.id}`);
  };

  return (
    <div className={styles.category} onClick={handleOpenCategory}>
      <Image
        className={styles.img}
        src={category?.image}
        alt={category?.name}
        width={500}
        height={500}
        loading="lazy"
      />
      <div className={styles.category__see_all}>
        <Link
          href={{
            pathname: `${category?.link}`,
            query: { category: category?.id },
          }}
          prefetch={true}
        >
          <button>
            {header}
            {!query400px && <IoIosArrowForward size={22} />}
          </button>
        </Link>
      </div>
    </div>
  );
}
