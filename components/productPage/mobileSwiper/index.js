"use client";
import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Swiper = dynamic(() => import("swiper/react").then((m) => m.Swiper), {
  ssr: false,
});

export default function MobileSwiper({ images }) {
  // State for managing full-screen modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open the full-screen overlay with a specific image
  const openFullScreen = (url) => {
    setSelectedImage(url);
    setIsOpen(true);
  };

  // Close the full-screen overlay
  const closeFullScreen = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className={styles.swiper_product}>
      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        className="product_swiper"
      >
        {images?.map((image, i) => (
          <SwiperSlide key={i}>
            <Image
              src={image.url}
              alt={`somoselhueco-relacionado-${i}`}
              width={360}
              height={400}
              /* 
                Tapping the slide opens the overlay 
                (put the onClick on the wrapper, so the user sees it is interactive)
              */
              onClick={() => openFullScreen(image.url)}
              style={{ objectFit: "cover", cursor: "zoom-in" }}
              priority={true}
              blurDataURL={image.url}
              placeholder="blur"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className={styles.fullScreenOverlay}>
          <button className={styles.closeButton} onClick={closeFullScreen}>
            ✕
          </button>
          <TransformWrapper
            // Optional: you can customize behavior (limit pan, min/max scale, etc.)
            defaultScale={1}
            wheel={{ disabled: true }}
            // wheel disabled to avoid accidentally zooming with the mouse wheel in desktop dev
            doubleClick={{ disabled: false }}
            pinch={{ disabled: false }}
          >
            <TransformComponent>
              <div className={styles.fullScreenContent}>
                <Image
                  src={selectedImage}
                  alt="Full-size product image"
                  width={720} // Or something large enough for zoom
                  height={800}
                  style={{ objectFit: "contain", display: "block" }}
                  priority={true}
                  blurDataURL={selectedImage}
                  placeholder="blur"
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </div>
  );
}
