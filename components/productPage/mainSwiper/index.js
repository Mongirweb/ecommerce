"use client";
import styles from "./styles.module.scss";
import ReactImageMagnify from "react-image-magnify";
import { useState } from "react";
import Image from "next/image";
import ImageMagnifiers from "../../../utils/imageMagnifiers";

export default function MainSwiper({ images, activeImg }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.swiper}>
      <div className={styles.swiper__active}>
        <ImageMagnifiers
          src={activeImg || images[active]?.url}
          width={300}
          height={300}
          alt="Mongir Logo"
        />
      </div>
      <div className={styles.swiper__list}>
        {images?.map((img, i) => (
          <div
            className={`${styles.swiper__list_item} ${
              i == active && styles.active
            }`}
            key={i}
            onMouseOver={() => setActive(i)}
          >
            <Image
              src={img?.url}
              width={500}
              height={300}
              alt="Mongir Logo"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
