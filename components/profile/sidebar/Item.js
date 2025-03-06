import { useState } from "react";
import styles from "./styles.module.scss";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import slugify from "slugify";
import { useRouter, useSearchParams } from "next/navigation";

export default function Item({ item, visible, index }) {
  const [show, setShow] = useState(visible);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <li>
      {item.heading === "Sign out" ? (
        <b onClick={() => signOut()}>Sign out</b>
      ) : (
        <b onClick={() => setShow((prev) => !prev)}>
          {item.heading} {show ? <HiMinusSm /> : <HiPlusSm />}
        </b>
      )}
      {show && (
        <ul>
          {item.links.map((link, i) => (
            <li
              key={i}
              className={
                link.link.startsWith("/myprofile/orders")
                  ? (searchParams.get("q")?.split("__")[0] || "") ===
                    slugify(link.name, { lower: true })
                    ? styles.active
                    : ""
                  : (searchParams.get("q") || "") ===
                    slugify(link.name, { lower: true })
                  ? styles.active
                  : ""
              }
            >
              <Link
                href={`${link.link}?tab=${index}&q=${slugify(link.name, {
                  lower: true,
                })}${link.filter ? `__${link.filter}` : ""}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
