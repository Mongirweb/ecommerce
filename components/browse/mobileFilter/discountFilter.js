import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";
import { useSearchParams } from "next/navigation";

export default function DiscountFilter({
  toggleFilter,
  expandedFilters,
  discountHandler,
}) {
  const searchParams = useSearchParams();
  const [selectedPredefined, setSelectedPredefined] = useState(null);

  useEffect(() => {
    const discountQuery = searchParams.get("discount")?.split("_") || [];
    const min = discountQuery[0] || "";
    const max = discountQuery[1] || "";

    // Determine if the current discount range matches any predefined options
    const matchedOption = discountOptions.find((option) => {
      return Number(min) === option.min && Number(max) === option.max;
    });

    setSelectedPredefined(matchedOption ? matchedOption.key : null);
  }, [searchParams]);

  const discountOptions = [
    { label: "Menos de 10%", min: 0, max: 10, key: "lessThan10" },
    { label: "10% - 20%", min: 10, max: 20, key: "10to20" },
    { label: "20% - 30%", min: 20, max: 30, key: "20to30" },
    { label: "30% - 40%", min: 30, max: 40, key: "30to40" },
    { label: "40% - 50%", min: 40, max: 50, key: "40to50" },
    { label: "50% - 60%", min: 50, max: 60, key: "50to60" },
    { label: "60% - 70%", min: 60, max: 70, key: "60to70" },
    { label: "Más de 70%", min: 70, max: 100, key: "moreThan70" },
  ];

  const handlePredefinedDiscount = (min, max, key) => {
    discountHandler(min, max);
    setSelectedPredefined(key);
  };

  return (
    <li>
      <div className={styles.filterHeader} onClick={() => toggleFilter()}>
        <span>Descuentos</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {discountOptions.map((option) => (
            <div
              key={option.key}
              onClick={() =>
                handlePredefinedDiscount(option.min, option.max, option.key)
              }
              className={
                selectedPredefined === option.key
                  ? styles.activeOption
                  : styles.option
              }
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
