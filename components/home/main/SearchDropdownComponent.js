"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./main.module.scss"; // Import your SCSS module
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "../../ui/scroll-area";
import { RiSearch2Line } from "react-icons/ri";

export function SearchDropdownComponent({ setQuery, handleSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredItems([]);
    } else {
      setIsLoading(true);
      const searchedFor = searchTerm;
      fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`).then(
        async (results) => {
          const currentSearchTerm = inputRef.current?.value;
          if (currentSearchTerm !== searchedFor) {
            return;
          }
          const json = await results.json();
          setIsLoading(false);
          // Replace with the actual result:
          // setFilteredItems(json);
        }
      );
    }
  }, [searchTerm]);

  const params = useParams();
  useEffect(() => {
    if (!params?.product) {
      const subcategory = params?.subcategory;
      setSearchTerm(
        typeof subcategory === "string" ? subcategory.replaceAll("-", " ") : ""
      );
    }
  }, [params]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      router.push(filteredItems[highlightedIndex].href);
      setSearchTerm(filteredItems[highlightedIndex].name);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <div className={styles.search}>
        <input
          ref={inputRef}
          autoCapitalize="off"
          autoCorrect="off"
          type="text"
          placeholder="Busca en Somos el Hueco..."
          value={searchTerm}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
        />
        <X
          className={styles.clearButton}
          onClick={() => {
            setQuery("");
            setIsOpen(false);
          }}
        />
        <button type="submit" className={styles.search__icon}>
          <RiSearch2Line />
        </button>
      </div>
      {isOpen && (
        <div className={styles.dropdownContainer}>
          <ScrollArea className={styles.scrollArea}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <Link href={item.href} key={item.slug} prefetch={true}>
                  <div
                    className={`${styles.resultItem} ${
                      index === highlightedIndex
                        ? styles.highlightedResultItem
                        : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => {
                      setSearchTerm(item.name);
                      setIsOpen(false);
                      inputRef.current?.blur();
                    }}
                  >
                    <span className={styles.resultItemText}>{item.name}</span>
                  </div>
                </Link>
              ))
            ) : isLoading ? (
              <div className={styles.emptyState}>
                <p>Loading...</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No results found</p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
