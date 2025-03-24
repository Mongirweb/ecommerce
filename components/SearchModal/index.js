"use client";
import React, { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "./styles.module.scss";
import useClickOutside from "../../utils/useClickOutside";
import { useMobileSearch } from "../../context/MobileSearchContext";
import { useRouter } from "next/navigation";

export default function SearchModal() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const modalRef = useRef(null);
  const { isSearchOpen, closeSearch, modalData } = useMobileSearch();
  const router = useRouter();

  // Close modal when clicking outside
  useClickOutside(modalRef, () => {
    closeSearch();
  });

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    // Example: Fetch suggestions from an API when at least 2 characters
    if (value.length >= 2) {
      try {
        const res = await fetch(`/api/search-products?search=${value}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (router.pathname !== "/browse") {
      if (query.length > 1) {
        router.push(`/browse?search=${query}`);
        closeSearch();
      }
    } else {
      searchHandler(query);
      closeSearch();
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={closeSearch}>
          <IoMdClose size={24} />
        </button>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Busca en mongir..."
            value={query}
            onChange={handleInputChange}
            autoFocus
          />
          <button type="submit">Buscar</button>
        </form>
        {/* {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
