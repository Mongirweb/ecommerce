"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import image from "../../public/MONGIR-LOGO-TOP.png";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { useModal } from "../../context/ModalContext";
import useClickOutside from "../../utils/useClickOutside";
import SearchSuggestions from "./Suggestions";
import debounce from "lodash/debounce";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Menu } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Main({ searchHandler }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchQuery);
  const cart = useSelector((state) => state.cart);
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const { openModal } = useModal();
  const [suggestions, setSuggestions] = useState([]);
  const { openCart } = useCart();

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce(async (value) => {
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
    }, 300), // 300ms debounce
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (router.pathname !== "/browse") {
      if (query.length > 1) {
        router.push(`/browse?search=${query}`);
      }
    } else {
      searchHandler(query);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (router.pathname === "/browse") return;

    debouncedFetchSuggestions(value);
  };

  const handleOpenModal = () => {
    openModal({
      title: "Categorías",

      customClass: "pauseModal",
    });
  };
  const modal = useRef(null);
  useClickOutside(modal, () => setShowMenuMobile(false));

  const handleCloseSuggestions = () => {
    setSuggestions([]); // Clear suggestions
    setQuery(""); // Optionally clear the query
  };

  return (
    <div className={styles.main} ref={modal}>
      <div className={styles.main__container}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>
            <Image
              src={image}
              alt="somoselhueco-logo"
              loading="lazy"
              width={100}
              height={100}
            />
          </a>
        </Link>
        {/* <Link href="/browse">
          <div className={styles.option}>
            <BsFire /> En Promo
          </div>
        </Link> */}
        <div className={styles.option} onClick={() => handleOpenModal()}>
          Categorías <ChevronRight />
        </div>

        <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
          <input
            type="text"
            placeholder="Busca en Mongir..."
            value={query}
            onChange={handleInputChange}
            autoCorrect="off"
          />

          <button type="submit" className={styles.search__icon}>
            <Search />
          </button>
        </form>
        {suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            query={searchQuery}
            handleCloseSuggestions={handleCloseSuggestions}
            handleSearch={handleSearch}
          />
        )}

        {/* <SearchDropdownComponent
          setQuery={setQuery}
          handleSearch={handleSearch}
        /> */}

        <div
          className={styles.menu_menu}
          onClick={() => setShowMenuMobile((prev) => !prev)}
        >
          <Menu />
        </div>
        <Link href="/cart" legacyBehavior>
          <a className={styles.cart}>
            <ShoppingCart />
            <span>{cart?.cartItems?.length}</span>
          </a>
        </Link>
        {/* <a onClick={() => openCart()}>
          <div className={styles.cart}>
            <ShoppingCart />
            <span>{cart?.cartItems?.length}</span>
          </div>
        </a> */}
      </div>
      {showMenuMobile ? (
        <MobileMenu
          setShowMenuMobile={setShowMenuMobile}
          handleOpenModal={handleOpenModal}
        />
      ) : null}
    </div>
  );
}
