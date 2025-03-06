// components/browse/sizesFilter/index.js

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import Size from "./Size";

export default function SizesFilter({ sizes, sizeHandler }) {
  const searchParams = useSearchParams();
  const existedSize = searchParams.get("size") || "";
  const [show, setShow] = useState(true);

  return (
    <div className={styles.filter}>
      <h3 onClick={() => setShow(!show)}>
        Tallas: <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {sizes?.map((size, i) => (
            <div
              key={i}
              onClick={() =>
                sizeHandler(existedSize ? `${existedSize}_${size}` : size)
              }
            >
              <Size size={size} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
