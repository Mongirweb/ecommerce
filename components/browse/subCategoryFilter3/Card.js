import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";

export default function Card({
  subcategory,
  subCategory3Handler,
  replaceQuery,
}) {
  const [show, setShow] = useState(false);
  const check = replaceQuery("subcategory3", subcategory._id);

  return (
    <>
      <section>
        <li onClick={() => subCategory3Handler(subcategory._id)}>
          <input
            type="radio"
            name="filter"
            id={subcategory._id}
            checked={check.active}
          />
          <label htmlFor={subcategory._id}>
            <a>
              {subcategory?.name?.length > 25
                ? `${subcategory?.name?.slice(0, 25)}...`
                : subcategory.name}
            </a>
          </label>
          <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
        </li>
      </section>
    </>
  );
}
