import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
export default function Card({ category, categoryHandler, replaceQuery }) {
  const [show, setShow] = useState(false);
  const check = replaceQuery("category", category.id);

  return (
    <>
      <section>
        <li onClick={() => categoryHandler(category.id)}>
          <input
            type="radio"
            name="filter"
            id={category.id}
            checked={check.active}
          />
          <label htmlFor={category.id}>
            <a>
              {category?.name?.length > 25
                ? `${category?.name?.slice(0, 25)}...`
                : category.name}
            </a>
          </label>
          <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
        </li>
      </section>
    </>
  );
}
