// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export default function MainSwiper() {
  const query450px = useMediaQuery({ query: "(max-width:450px)" });
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
        {[...Array(1)?.keys()]?.map((i) => (
          <SwiperSlide key={i}>
            <Image
              src="https://res.cloudinary.com/danfiejkv/image/upload/v1741889736/Mongir-almacen-tienda-bebe-foto-portada_rvst5a.avif" // Update the src to start with a leading slash
              alt="Mongir Logo"
              width={1200}
              height={1100}
              quality={70}
              loading="lazy"
            />
            <div
              style={
                !query450px
                  ? {
                      position: "absolute",
                      top: "88%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#d7f3ff",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      fontWeight: "900",
                    }
                  : {
                      position: "absolute",
                      top: "90%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#d7f3ff",
                      padding: "10px 10px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "70%",
                    }
              }
            >
              Somos amor y familia
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
