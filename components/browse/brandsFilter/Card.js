import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
export default function Card({ brand, brandHandler, replaceQuery }) {
  const [show, setShow] = useState(false);
  const check = replaceQuery("brand", brand);

  return (
    <>
      <section>
        <li onClick={() => brandHandler(brand)}>
          <input
            type="checkbox"
            name="filter"
            id={brand}
            checked={check.active}
          />
          <label htmlFor={brand}>
            <a>{brand?.length > 25 ? `${brand?.slice(0, 25)}...` : brand}</a>
          </label>
          <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
        </li>
      </section>
    </>
  );
}
