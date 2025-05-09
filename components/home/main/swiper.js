"use client";
import React, { useRef, useState } from "react";
import styles from "./main.module.scss";
// Import Swiper React components
import { SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";

const Swiper = dynamic(() => import("swiper/react").then((m) => m.Swiper), {
  ssr: false,
});

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

import { useMediaQuery } from "react-responsive";

const bgImage = [
  "https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1746368097/MONGIR-TIENDA-BEBE-MAYORISTA_v5tas5.webp",
];

const bgImageMobile = [
  "https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1746196695/mogir-tienda-bebe-mobil_gungzz.webp",
];

export default function MainSwiper() {
  const query1050px = useMediaQuery({
    query: "(max-width:1050px)",
  });
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
          delay: 10500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mainSwiper"
        effect="fade"
      >
        {query1050px
          ? bgImageMobile?.map((i) => (
              <SwiperSlide key={i}>
                <Image
                  src={i} // Update the src to start with a leading slash
                  alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                  width={500}
                  height={100}
                  sizes="(max-width: 450px) 50vw,
                  (max-width: 991px) 33vw,
                  20vw"
                  blurDataURL={i}
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading="eager"
                />
              </SwiperSlide>
            ))
          : bgImage?.map((i) => (
              <SwiperSlide key={i}>
                <Image
                  src={i} // Update the src to start with a leading slash
                  alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                  width={1000}
                  height={500}
                  sizes="(max-width: 450px) 50vw,
                  (max-width: 991px) 33vw,
                  20vw"
                  blurDataURL={i}
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading="eager"
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </>
  );
}
