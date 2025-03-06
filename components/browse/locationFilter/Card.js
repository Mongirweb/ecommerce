import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
export default function Card({ location, locationHandler, replaceQuery }) {
  const [show, setShow] = useState(false);
  const check = replaceQuery("location", location.name);

  return (
    <>
      <section>
        <li>
          <input
            type="radio"
            name="location"
            id={location.name}
            checked={check.active}
            onChange={() => locationHandler(location.name)}
          />
          <label htmlFor={location.name}>
            <a>
              {location?.name?.length > 25
                ? `${location?.name?.slice(0, 25)}...`
                : location.name}
            </a>
          </label>
          <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
        </li>
      </section>
    </>
  );
}
