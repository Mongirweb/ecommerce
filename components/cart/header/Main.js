"use client";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useState } from "react";

import image from "../../../public/MONGIR-LOGO.png";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

export default function Main({ searchHandler }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    if (router.pathname !== "/browse") {
      if (query.length > 1) {
        router.push(`/browse?search=${query}`);
      }
    } else {
      searchHandler(query);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.main__container}>
        <Link href="/" legacyBehavior prefetch={true}>
          <a className={styles.logo}>
            <Image src={image} alt="Mongir Logo" loading="lazy" />
          </a>
        </Link>
        <div className={styles.main__container_text}>
          <Link href="/" prefetch={true}>
            <p>
              SEGUIR COMPRANDO <FaArrowRight />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
