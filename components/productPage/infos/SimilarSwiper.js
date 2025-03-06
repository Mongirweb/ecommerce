import Link from "next/link";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import { simillar_products } from "../../../data/products";
import Image from "next/image";
export default function SimillarSwiper() {
  const imageLoader = ({ src, width, quality }) => {
    return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={5}
      slidesPerGroup={3}
      navigation={true}
      modules={[Navigation]}
      className="swiper simillar_swiper products__swiper"
      breakpoints={{
        640: {
          width: 640,
          slidesPerView: 5,
        },
      }}
    >
      {simillar_products?.map((p, i) => (
        <SwiperSlide key={i}>
          <Link href="" prefetch={true}>
            <Image
              src={p}
              alt="saldo-mania-producto-parecido"
              loader={imageLoader}
              fill={true}
              priority={false}
              loading="lazy"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
