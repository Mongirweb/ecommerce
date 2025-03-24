// ModalContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const MobileSearchContext = createContext({
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
  modalData: null,
});

export const MobileSearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openSearch = (data = {}) => {
    setModalData(data);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset on component unmount
    };
  }, [isSearchOpen]);

  return (
    <MobileSearchContext.Provider
      value={{ isSearchOpen, openSearch, closeSearch, modalData }}
    >
      {children}
    </MobileSearchContext.Provider>
  );
};

export const useMobileSearch = () => useContext(MobileSearchContext);
