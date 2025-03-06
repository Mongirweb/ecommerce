"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { IoMdArrowRoundForward } from "react-icons/io";

export default function PriceFilters({ priceHandler }) {
  const [show, setShow] = useState(true);
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState(null);

  // Format the number with dots as thousand separators
  const formatNumber = (value) => {
    if (!value) return "";
    const number = Number(value.toString().replace(/\./g, ""));
    return number.toLocaleString("de-DE"); // "de-DE" uses dots as thousand separators
  };

  // Parse the formatted number back to raw number string without dots
  const parseNumber = (formattedValue) => {
    if (!formattedValue) return "";
    return formattedValue.toString().replace(/\./g, "");
  };

  useEffect(() => {
    const priceQuery = searchParams.get("price")?.split("_") || [];
    setMinPrice(formatNumber(priceQuery[0]) || "");
    setMaxPrice(formatNumber(priceQuery[1]) || "");

    // Determine if the current price range matches any predefined options
    const min = priceQuery[0] || "";
    const max = priceQuery[1] || "";

    if (min === "0" && max === "50000") {
      setSelectedPredefined("lessThan50k");
    } else if (min === "50000" && max === "100000") {
      setSelectedPredefined("50kTo100k");
    } else if (min === "100000" && max === "200000") {
      setSelectedPredefined("100kTo200k");
    } else {
      setSelectedPredefined(null);
    }
  }, [searchParams]);

  const handleApplyPriceFilter = () => {
    const minPriceRaw = parseNumber(minPrice);
    const maxPriceRaw = parseNumber(maxPrice);
    priceHandler(minPriceRaw, maxPriceRaw);
    setSelectedPredefined(null);
  };

  const handleMinPriceChange = (e) => {
    const inputValue = e.target.value;
    // Remove any non-digit and non-dot characters
    const cleanedValue = inputValue.replace(/[^\d\.]/g, "");
    const rawValue = parseNumber(cleanedValue);
    if (!isNaN(rawValue)) {
      setMinPrice(formatNumber(rawValue));
    }
    setSelectedPredefined(null);
  };

  const handleMaxPriceChange = (e) => {
    const inputValue = e.target.value;
    // Remove any non-digit and non-dot characters
    const cleanedValue = inputValue.replace(/[^\d\.]/g, "");
    const rawValue = parseNumber(cleanedValue);
    if (!isNaN(rawValue)) {
      setMaxPrice(formatNumber(rawValue));
    }
    setSelectedPredefined(null);
  };

  const handlePredefinedPrice = (min, max, label) => {
    setMinPrice(formatNumber(min));
    setMaxPrice(formatNumber(max));
    priceHandler(min, max);
    setSelectedPredefined(label); // Set the selected label
  };

  return (
    <div className={styles.filter}>
      <h3>
        Precio:
        <span onClick={() => setShow(!show)}>
          {show ? <FaMinus /> : <BsPlusLg />}
        </span>
      </h3>
      <div className={styles.filter__prices}>
        <div
          onClick={() => handlePredefinedPrice("0", "50000", "lessThan50k")}
          className={
            selectedPredefined === "lessThan50k"
              ? styles.activeOption
              : styles.option
          }
        >
          Menos de $50.000
        </div>
        <div
          onClick={() => handlePredefinedPrice("50000", "100000", "50kTo100k")}
          className={
            selectedPredefined === "50kTo100k"
              ? styles.activeOption
              : styles.option
          }
        >
          de $50.000 a $100.000
        </div>
        <div
          onClick={() =>
            handlePredefinedPrice("100000", "200000", "100kTo200k")
          }
          className={
            selectedPredefined === "100kTo200k"
              ? styles.activeOption
              : styles.option
          }
        >
          de $100.000 a $200.000
        </div>
      </div>
      {show && (
        <>
          <div className={styles.filter__price}>
            <span>Precio :</span>
            <input
              type="text"
              placeholder="min"
              min="0"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            a
            <input
              type="text"
              placeholder="max"
              min="0"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <div
              className={styles.filter__forward}
              onClick={handleApplyPriceFilter}
            >
              <div
                className={
                  minPrice || maxPrice
                    ? `${styles.filter__forward_circle} ${styles.filter__forward_circleActive}`
                    : styles.filter__forward_circle
                }
              >
                <IoMdArrowRoundForward />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
