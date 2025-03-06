import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./header.module.scss";
import { IoClose } from "react-icons/io5";

const SearchSuggestions = ({
  suggestions,
  query,
  handleCloseSuggestions,
  handleSearch,
}) => {
  const router = useRouter();

  const highlightText = (text, query) => {
    if (!query) return text; // Return original text if query is empty

    const regex = new RegExp(`(${query})`, "gi"); // Create a regex to match the query (case insensitive)
    const parts = text.split(regex); // Split the text by the query

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="highlight-text">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handlePush = (slug) => {
    router.push(`/product/${slug}?style=0&size=0`);
  };

  return (
    <div className={styles.suggestions_container}>
      <div className={styles.suggestions_header}>
        <h3>Resultados:</h3>
        <IoClose onClick={() => handleCloseSuggestions()} />
      </div>

      <ul>
        {suggestions.map((sugg, i) => (
          <li
            key={i}
            className={styles.suggestion_item}
            onClick={() => handlePush(sugg.slug)}
          >
            <Image
              src={sugg.image}
              alt={sugg.name}
              width={50}
              height={50}
              className="suggestion-image"
            />
            <div className={styles.suggestion_text}>
              <span className={styles.suggestion_name}>
                {highlightText(
                  sugg.name.length > 40
                    ? `${sugg.name.substring(0, 40)}...`
                    : sugg.name,
                  query
                )}
              </span>
            </div>
          </li>
        ))}
        <li>
          <div
            className={styles.suggestion_seeAall}
            onClick={(e) => handleSearch(e)}
          >
            <span>Ver todo</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SearchSuggestions;
