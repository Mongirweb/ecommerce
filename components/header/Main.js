"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { RiSearch2Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import image from "../../public/MONGIR-LOGO.png";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BsFire } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import MobileMenu from "./MobileMenu";
import { useModal } from "../../context/ModalContext";
import useClickOutside from "../../utils/useClickOutside";
import { SearchDropdownComponent } from "../home/main/SearchDropdownComponent";
import SearchSuggestions from "./Suggestions";
import { useMediaQuery } from "react-responsive";

export default function Main({ searchHandler }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchQuery);
  const cart = useSelector((state) => state.cart);
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const { openModal } = useModal();
  const [suggestions, setSuggestions] = useState([]);

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

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value); // Correctly updating the `query` state

    if (router.pathname === "/browse") return; // Accessing `router.pathname` instead of undefined `pathname`

    if (value.length >= 2) {
      try {
        const res = await fetch(`/api/search-products?search=${value}`);
        const data = await res.json();
        setSuggestions(data); // Updating suggestions with the fetched data
      } catch (error) {
        console.error("Error fetching suggestions:", error); // Add error logging for debugging
        setSuggestions([]); // Reset suggestions on error
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is less than 2 characters
    }
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

  const query650px = useMediaQuery({
    query: "(min-width:650px)",
  });

  const query950px = useMediaQuery({
    query: "(min-width:950px)",
  });

  const query850px = useMediaQuery({
    query: "(min-width:850px)",
  });
  const query750px = useMediaQuery({
    query: "(min-width:750px)",
  });

  return (
    <div className={styles.main} ref={modal}>
      <div className={styles.main__container}>
        <div className={styles.main__container_options}>
          {query850px ? (
            <Link
              href={{
                pathname: `browse`,
                query: { category: "67d3450902d26a8677f2e260" },
              }}
            >
              <div className={styles.option}>Primer día</div>
            </Link>
          ) : null}
          {query750px ? (
            <Link
              href={{
                pathname: `browse`,
                query: { category: "67d344eb02d26a8677f2e228" },
              }}
            >
              <div className={styles.option}>Ropa</div>
            </Link>
          ) : null}
          {query950px ? (
            <Link
              href={{
                pathname: `browse`,
                query: { category: "67d344f302d26a8677f2e236" },
              }}
            >
              <div className={styles.option}>Calzado</div>
            </Link>
          ) : null}
          {query650px ? (
            <Link
              href={{
                pathname: `browse`,
                query: { category: "67d344fa02d26a8677f2e244" },
              }}
            >
              <div className={styles.option}>Accesorios</div>
            </Link>
          ) : null}
          {query650px ? (
            <div className={styles.option} onClick={() => handleOpenModal()}>
              Ver más
            </div>
          ) : null}
          {query650px ? null : (
            <div className={styles.menu_menu} onClick={() => handleOpenModal()}>
              <IoMenu />
            </div>
          )}
        </div>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>
            <Image
              src={image}
              alt="mongir-logo"
              loading="lazy"
              width={100}
              height={100}
            />
          </a>
        </Link>
        <div className={styles.main__container_options}>
          <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
            <input
              type="text"
              placeholder="Busca en mongir..."
              value={query}
              onChange={handleInputChange}
            />

            <button type="submit" className={styles.search__icon}>
              <RiSearch2Line />
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

          <Link href="/cart" legacyBehavior>
            <a className={styles.cart}>
              <FiShoppingCart />
              <span>{cart?.cartItems?.length}</span>
            </a>
          </Link>
        </div>
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
