"use client";
import React from "react";
import styles from "./styles.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
import { useMediaQuery } from "react-responsive";
import SimilarCard from "./similarCard";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function ProductsSwiper({
  header,
  products,
  bg,
  setSimilarPage,
  similarLoading,
}) {
  const isLoading = !products || products.length === 0 || similarLoading;
  const query449px = useMediaQuery({ query: "(max-width:449px)" });
  const appearBullet = query449px;

  // This function will be called every time the user reaches the last slide.
  // Typically, you'd want to increment the page:
  const handleReachEnd = () => {
    // If you want to ALWAYS set to 1 (maybe for a special reason):
    // setSimilarPage(1);

    // If you want to increment the page each time:
    setSimilarPage((prev) => prev + 1);
  };

  return (
    <div className={styles.wrapper}>
      {header && (
        <div
          className={styles.header}
          style={{ background: `${bg ? bg : ""}` }}
        >
          {header}
        </div>
      )}

      {isLoading ? (
        <Swiper
          slidesPerView={2.2}
          spaceBetween={0}
          navigation={false}
          modules={[Navigation, Pagination]}
          className="offers_swiper"
          freeMode={true}
          direction="horizontal"
          mousewheel={true}
          breakpoints={{
            450: { slidesPerView: 2.2 },
            630: { slidesPerView: 3.2 },
            920: { slidesPerView: 4.2 },
            1232: { slidesPerView: 5.2 },
            1520: { slidesPerView: 6.2 },
          }}
        >
          {[...Array(6)].map((_, i) => (
            <SwiperSlide key={i}>
              <Skeleton
                height={200}
                width="100%"
                borderRadius={8}
                style={{ margin: "10px" }}
              />
              <Skeleton width="80%" style={{ marginTop: "10px" }} />
              <Skeleton width="60%" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Swiper
          slidesPerView={2.2}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Pagination]}
          pagination={
            appearBullet
              ? {
                  clickable: true,
                }
              : false
          }
          className="products__swiper"
          onReachEnd={handleReachEnd}
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
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <SimilarCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
