"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "./styles.module.scss";
import useClickOutside from "../../../utils/useClickOutside";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

export default function CartModal() {
  const [query, setQuery] = useState("");
  const modalRef = useRef(null);
  const { isCartOpen, closeCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close modal when clicking outside
  useClickOutside(modalRef, () => {
    closeCart();
  });

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    // Example: Fetch suggestions from an API when at least 2 characters
    // if (value.length >= 2) {
    //   try {
    //     const res = await fetch(`/api/search-products?search=${value}`);
    //     const data = await res.json();
    //     setSuggestions(data);
    //   } catch (error) {
    //     console.error("Error fetching suggestions:", error);
    //     setSuggestions([]);
    //   }
    // } else {
    //   setSuggestions([]);
    // }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.length < 2) return; // require at least 2 chars

    if (pathname !== "/browse") {
      // If not on /browse, navigate there
      router.push(`/browse?search=${query}`);
      closeCart();
    } else {
      // If already on /browse, call any local "searchHandler" you have
      // For example, if you had a function in context or props
      // searchHandler(query);
      router.push(`/browse?search=${query}`);
      closeCart();
    }
  };
  // reset to “in” any time it re-opens
  useEffect(() => {
    if (isCartOpen === true) {
      setOpen(true);
    }
  }, [isCartOpen]);

  const handleClose = () => {
    setOpen(false); // dispara animación de salida
  };

  const onAnimEnd = () => {
    // cuando la animación de salida terminó
    if (open === false) {
      // ya está “cerrándose”
      closeCart(); // desmonta el modal
      setOpen(true);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${open ? styles.slideIn : styles.slideOut}`}
        ref={modalRef}
        onAnimationEnd={onAnimEnd}
      >
        <button className={styles.closeButton} onClick={handleClose}>
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
