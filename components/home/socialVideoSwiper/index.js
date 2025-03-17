"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // or any modules you want
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SocialVideoEmbed from "../showVideo";
import styles from "./styles.module.scss";
import { useMediaQuery } from "react-responsive";

export default function SocialVideoSwiper({ videos }) {
  const query449px = useMediaQuery({
    query: "(max-width:449px)",
  });
  const appearBullet = query449px;
  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation, Pagination]}
        pagination={
          appearBullet
            ? {
                clickable: true,
              }
            : false
        }
        className="videos__swiper"
        allowTouchMove={true}
        grabCursor={true}
        breakpoints={{
          450: {
            slidesPerView: 1.2,
          },
          630: {
            slidesPerView: 1.5,
          },
          920: {
            slidesPerView: 2.1,
          },
          1100: {
            slidesPerView: 2.5,
          },
          1232: {
            slidesPerView: 3.2,
          },
          1520: {
            slidesPerView: 4.1,
          },
        }}
      >
        {videos?.map((video, idx) => (
          <SwiperSlide key={idx}>
            <SocialVideoEmbed
              platform={video.platform}
              embedUrl={video.embedUrl}
              videoId={video.videoId}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
