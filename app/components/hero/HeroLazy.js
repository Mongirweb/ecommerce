/* app/components/hero/HeroLazy.tsx */
"use client";

import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ───────────────────────── 1. Fallback component ────────────────────────── */
function HeroFallback() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(max-width:620px)");
    const update = () => setMobile(mq.matches);
    update(); // first run
    mq.addEventListener("change", update); // listen for resize
    return () => mq.removeEventListener("change", update);
  }, []);

  const src = mobile
    ? "https://res.cloudinary.com/danfiejkv/image/upload/q_100/v1746196695/mogir-tienda-bebe-mobil_gungzz.webp"
    : "https://res.cloudinary.com/danfiejkv/image/upload/q_50/v1746368097/MONGIR-TIENDA-BEBE-MAYORISTA_v5tas5.webp";

  return (
    <Image
      src={src}
      alt="Somos el Hueco – mejores precios del Hueco"
      width={500}
      height={100}
      blurDataURL={src}
      priority
      loading="eager"
      sizes="(max-width:1050px) 100vw, 
           (min-width:1051px) 66vw" // browser picks the right width
      style={{ width: "100%", height: "auto", objectFit: "cover" }}
    />
  );
}

/* ───────────────────────── 2. Lazy-load Swiper ──────────────────────────── */
const SwiperHero = dynamic(
  () => import("../../../components/home/main/swiper"),
  { ssr: false, loading: () => <HeroFallback /> } // ⬅️ use our custom fallback
);

/* ───────────────────────── 3. Intersection Observer ─────────────────────── */
export default function HeroLazy() {
  const { ref, inView } = useInView({ rootMargin: "300px" });

  return <div ref={ref}>{inView && <SwiperHero />}</div>;
}
