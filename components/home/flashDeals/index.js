import styles from "./flashdeals.module.scss";
import { MdFlashOn } from "react-icons/md";
import Countdown from "../../countdown";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
import FlashCard from "./Card";
import { useMediaQuery } from "react-responsive";
import { HiArrowRightCircle } from "react-icons/hi2";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function Flashdeals({ products, setOffersProductsPage }) {
  const isLoading = !products || products.length === 0;

  const query449px = useMediaQuery({
    query: "(max-width:449px)",
  });
  const query653px = useMediaQuery({
    query: "(max-width:653px)",
  });
  const query671px = useMediaQuery({
    query: "(max-width:671px)",
  });
  const query1204px = useMediaQuery({
    query: "(max-width:1240px)",
  });
  const appearBullet = query449px;

  const handleUpdateFetchOffers = () => {
    setOffersProductsPage((prev) => prev + 1);
  };

  return (
    <div className={styles.flashDeals}>
      <div className={styles.flashDeals__header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          Ofertas relámpago
          <MdFlashOn />
        </div>
        <Countdown date={new Date(2024, 8, 30)} />
      </div>
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
          navigation={!appearBullet}
          pagination={
            appearBullet
              ? {
                  clickable: true,
                }
              : false
          }
          modules={[Navigation, Pagination]}
          className="flashDeals__swiper"
          onReachEnd={handleUpdateFetchOffers}
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
          <div className={styles.flashDeals__list}>
            {products?.map((product, i) => (
              <SwiperSlide key={i} className={styles.swiperSlide}>
                <FlashCard product={product} key={i} />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      )}

      <div className={styles.flashDeals__see_all}>
        {/* <button>Ver todo Ofertas</button> */}
      </div>
    </div>
  );
}
