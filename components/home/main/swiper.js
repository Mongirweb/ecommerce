import React, { useRef, useState } from "react";
import styles from "./main.module.scss";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export default function MainSwiper() {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mainSwiper"
      >
        {[...Array(4)?.keys()]?.map((i) => (
          <SwiperSlide key={i}>
            <Image
              src={`/images/swiper/${i + 1}.avif`} // Update the src to start with a leading slash
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
              width={1200}
              height={1100}
              quality={70}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
