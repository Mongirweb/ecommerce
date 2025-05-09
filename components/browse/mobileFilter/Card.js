import styles from "../styles.module.scss";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
export default function Card({
  category,
  categoryHandler,
  replaceQuery,
  setOpenMenuMobile,
}) {
  const [show, setShow] = useState(false);
  const check = replaceQuery("category", category._id);

  return (
    <>
      <section>
        <div
          onClick={() => {
            categoryHandler(category._id);
            setOpenMenuMobile(false);
          }}
        >
          <label htmlFor={category._id}>
            <a>
              {category?.name?.length > 30
                ? `${category?.name?.slice(0, 30)}...`
                : category.name}
            </a>
          </label>
        </div>
      </section>
    </>
  );
}
