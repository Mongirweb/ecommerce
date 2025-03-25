import React from "react";
import styles from "./styles.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

// import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

export default function CategoriesSwiper({ categories, bg }) {
  const query449px = useMediaQuery({
    query: "(max-width:449px)",
  });

  const appearBullet = query449px;

  // Define autoplay and freeMode configuration conditionally
  const autoplayConfig = query449px
    ? {
        delay: 0,
        disableOnInteraction: false,
      }
    : false;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header} style={{ background: `${bg ? bg : ""}` }}>
        EXPLORA TODAS LAS CATEGORÍAS
      </div>

      <Swiper
        slidesPerView={1.2} // Adjust slides per view based on screen size
        spaceBetween={query449px ? 0 : 10} // Remove space between slides for a smooth effect on small screens
        loop={true} // Enable continuous loop mode
        freeMode={query449px} // Enable free mode for smooth scrolling on small screens
        speed={query449px ? 26000 : 500} // Slow scrolling effect for small screens
        autoplay={autoplayConfig} // Conditionally apply autoplay
        navigation={!query449px} // Disable navigation arrows on small screens
        modules={[Navigation, Pagination, Autoplay]} // Include required modules
        className="categories__swiper"
        breakpoints={{
          320: {
            slidesPerView: 3.2,
          },
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
            slidesPerView: 6.2,
          },
          1520: {
            slidesPerView: 7.2,
          },
        }}
      >
        {categories?.map((categorie, index) => (
          <SwiperSlide key={index}>
            <Link
              href={{
                pathname: `${categorie.link}`,
                query: { category: categorie.id },
              }}
              prefetch={true}
            >
              <div className={styles.product} key={index}>
                <div className={styles.product__img}>
                  <Image
                    height={400}
                    width={300}
                    src={categorie.image}
                    loading="lazy"
                    alt="Mongir Logo"
                  />
                </div>
                <div className={styles.product__infos}>
                  <p>
                    {categorie?.name.length > 30
                      ? `${categorie?.name?.slice(0, 30)}...`
                      : categorie?.name}
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
