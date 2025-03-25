import Image from "next/image";
import { sidebarData } from "../../../data/profile";
import Item from "./Item";
import styles from "./styles.module.scss";

export default function Sidebar({ data }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__container}>
        <Image
          width={50}
          height={50}
          src={data.image || "/default-image.png"} // Provide a default image if undefined
          alt="Mongir Logo"
          className={styles.userImage}
          loading="lazy"
        />
        <span className={styles.sidebar__name}>{data.name}</span>
        <p>Opciones:</p>
        <ul>
          {sidebarData?.map((item, i) => (
            <Item
              key={i}
              item={item}
              visible={data.tab === i.toString()}
              index={i.toString()}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
