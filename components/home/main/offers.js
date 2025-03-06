import styles from "./main.module.scss";

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { offersAarray } from "../../../data/home";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

export default function Offers() {
  return (
    <div className={styles.offers}>
      <div className={styles.offers__text}>
        <div></div>
        <span>Productos recomendados</span>
        <Link href="/browse" prefetch={true}>
          Ver todo
        </Link>
      </div>

      <Swiper
        slidesPerView={1.2}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="offers_swiper"
        breakpoints={{
          450: {
            slidesPerView: 2.2,
          },
          630: {
            slidesPerView: 3.2,
          },
          920: {
            slidesPerView: 4.2,
          },
          1232: {
            slidesPerView: 5.2,
          },
          1520: {
            slidesPerView: 6.2,
          },
        }}
      >
        {offersAarray?.map((offer, i) => (
          <SwiperSlide key={i}>
            <Link href="" prefetch={true}>
              <img src={offer?.image} alt="" />
            </Link>
            <span>{offer?.price}$</span>
            <span>-{offer?.discount}%</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
