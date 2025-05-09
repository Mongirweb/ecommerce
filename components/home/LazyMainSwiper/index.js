// components/home/LazyMainSwiper.tsx
"use client";
import dynamic from "next/dynamic";
import MainSwiperSkeleton from "../../skeletons/MainSwiperSkeleton";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function LazyMainSwiper() {
  const [InView, setInView] = useState(false);

  const { ref, inView } = useInView({
    /* 
      fire when it’s within 200px of the viewport 
      so the carousel can hydrate just before entry 
    */
    rootMargin: "200px",
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) setInView(true);
  }, [inView]);

  const MainSwiper = dynamic(
    () => import("../../../components/home/main/swiper"),
    {
      ssr: false,
      loading: () => <MainSwiperSkeleton />,
    }
  );

  return (
    <div ref={ref}>
      {inView && <MainSwiper />}
      {!inView && <MainSwiperSkeleton />}
    </div>
  );
}
