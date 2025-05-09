// ModalContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext({
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  modalData: null,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openCart = (data = {}) => {
    setModalData(data);
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset on component unmount
    };
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{ isCartOpen, openCart, closeCart, modalData }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
