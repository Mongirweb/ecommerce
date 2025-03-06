"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { RiSearch2Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import image from "../../public/somos-el-hueco-medellin-logo-circulo.avif";
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

  console.log(cart);

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
        <Link href="/browse">
          <div className={styles.option}>
            <BsFire /> En Promo
          </div>
        </Link>
        <div className={styles.option} onClick={() => handleOpenModal()}>
          Categorias <IoIosArrowForward />
        </div>

        <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
          <input
            type="text"
            placeholder="Busca en Somos el Hueco..."
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

        <div
          className={styles.menu_menu}
          onClick={() => setShowMenuMobile((prev) => !prev)}
        >
          <IoMenu />
        </div>
        <Link href="/cart" legacyBehavior>
          <a className={styles.cart}>
            <FaShoppingCart />
            <span>{cart?.cartItems?.length}</span>
          </a>
        </Link>
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
