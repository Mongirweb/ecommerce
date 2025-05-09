"use client";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useState } from "react";

import image from "../../../public/MONGIR-LOGO.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { signOut, signIn } from "next-auth/react";

export default function Main({ searchHandler, session }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchQuery);

  const pathname = usePathname();

  const isPay = pathname.includes("/checkout", "/order");

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
            <Image src={image} alt="somoselhueco-logo" loading="lazy" />
          </a>
        </Link>
        <div className={styles.main__container_text}>
          <p>
            SEGUIR COMPRANDO <ChevronRight />
          </p>
        </div>
      </div>
    </div>
  );
}
