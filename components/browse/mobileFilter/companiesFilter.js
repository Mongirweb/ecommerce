import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./styles.module.scss";

export default function CompaniesFilter({
  toggleFilter,
  expandedFilters,
  companies,
  companyHandler,
  setOpenMenuMobile,
}) {
  return (
    <li>
      <div
        className={styles.filterHeader}
        onClick={() => {
          toggleFilter();
        }}
      >
        <span>Empresas</span>
        {expandedFilters ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {expandedFilters && (
        <div className={styles.filterOptions}>
          {companies?.map((company, i) => (
            <span
              key={i}
              onClick={() => {
                companyHandler(company._id);
                setOpenMenuMobile(false);
              }}
            >
              {company.businessName}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
