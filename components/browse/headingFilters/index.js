"use client";
import { Tooltip } from "@mui/material";
import styles from "./styles.module.scss";
import { AiTwotoneStar } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { BsCheckLg } from "react-icons/bs";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HeadingFilters({
  priceHandler,
  multiPriceHandler,
  shippingHandler,
  replaceQuery,
  ratingHandler,
  sortHandler,
}) {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const shippingParam = searchParams.get("shipping");
  const sortQuery = searchParams.get("sort") || "";
  const check = replaceQuery("shipping", shippingParam == "0" ? false : "0");

  const checkRating = replaceQuery("rating", "4");

  return (
    <div className={styles.filters}>
      <div className={styles.filters__sort}>
        <span>Ordenar por:</span>
        <div
          className={styles.filters__sort_list}
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <button>
            {sortQuery === ""
              ? "Recommend"
              : sortingOptions.find((x) => x.value === sortQuery)?.name ||
                "Recommend"}
            <div
              style={{ transform: `${show ? "rotate(180deg)" : "rotate(0)"}` }}
            >
              <IoIosArrowDown />
            </div>
          </button>
          <ul
            style={{
              transform: `${show ? "scale3d(1,1,1)" : "scale3d(1,0,1)"}`,
            }}
          >
            {sortingOptions.map((option, i) => (
              <li key={i} onClick={() => sortHandler(option.value)}>
                <a>
                  {sortQuery === option.value ? (
                    <b>{option.name}</b>
                  ) : (
                    option.name
                  )}{" "}
                  {sortQuery === option.value ? <BsCheckLg /> : ""}
                  {sortQuery !== option.value ? (
                    <div className={styles.check}>
                      <BsCheckLg />
                    </div>
                  ) : (
                    ""
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <div
        className={styles.filters__shipping}
        onClick={() => shippingHandler(check.result)}
      >
        <input
          type="checkbox"
          name="shipping"
          id="shipping"
          checked={shippingParam === "0"}
        />
        <label htmlFor="shipping">Envío gratis</label>
      </div> */}
    </div>
  );
}

const sortingOptions = [
  {
    name: "Recomendados",
    value: "",
  },
  {
    name: "Más Populares",
    value: "popular",
  },
  {
    name: "Nuevos",
    value: "newest",
  },
  {
    name: "Más vendidos",
    value: "topSelling",
  },
  {
    name: "Mejor Calificados",
    value: "topReviewed",
  },
  {
    name: "Precio (menor a mayor)",
    value: "priceLowToHigh", // Fixed typo
  },
  {
    name: "Pricio (mayor a menor)",
    value: "priceHighToLow",
  },
];
