// app/product/[slug]/ProductClient.jsx
"use client";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import Link from "next/link";
import styles from "../../../styles/product.module.scss";
import {
  bringRelatedProducts,
  bringSimilarProducts,
} from "../../../requests/user";
import useIsMobile from "../../../hooks/useIsMobile";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { addToVisited, updateVisited } from "../../../store/visitedItemsSlice";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

// Dynamically import components
const Header = dynamic(() => import("../../../components/header"), {
  ssr: false,
});
const Footer = dynamic(() => import("../../../components/footer"), {
  ssr: false,
});
const Infos = dynamic(() => import("../../../components/productPage/infos"), {
  ssr: false,
});
const Reviews = dynamic(
  () => import("../../../components/productPage/reviews"),
  { ssr: false }
);
const ProductsSwiper = dynamic(
  () => import("../../../components/productsSwiper"),
  { ssr: false }
);
const SimillarSwiper2 = dynamic(
  () => import("../../../components/productPage/similarSwiper"),
  { ssr: false }
);
const DynamicMobileSwiper = dynamic(
  () => import("../../../components/productPage/mobileSwiper"),
  { ssr: false }
);
const DynamicMainSwiper = dynamic(
  () => import("../../../components/productPage/mainSwiper"),
  { ssr: false }
);

const alreadyFetchedPages = new Set(); // Track fetched pages
const alreadyFetchedPagesRelated = new Set(); // Track fetched pages

export default function ProductPageContent({ product, country, company }) {
  const [activeImg, setActiveImg] = useState("");
  const [related, setRelated] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [similarPage, setSimilarPage] = useState(0);
  const [relatedPage, setRelatedPage] = useState(0);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const visitedProducts = useSelector((state) => state.visitedProducts);
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get("size") || "";
  const dispatch = useDispatch();

  const { ref: similarRef, inView: similarInView } = useInView();
  const { ref: relatedRef, inView: relatedInView } = useInView();

  useEffect(() => {
    const handleAddToVisited = async () => {
      const { data } = await axios.get(
        `/api/product/${product._id}?style=${product.style}&size=${sizeParam}`
      );

      let _uid = `${data._id}_${product.style}_${sizeParam}`;
      let exist = visitedProducts?.userVisitedProducts?.find(
        (p) => p._uid === _uid
      );
      if (exist) {
        let newVisited = visitedProducts.userVisitedProducts.map((p) => {
          if (p._uid == exist._uid) {
            return { ...p, qty: qty };
          }
          return p;
        });
        dispatch(updateVisited(newVisited));
      } else {
        dispatch(
          addToVisited({
            ...data,
            size: data.size,
            _uid,
          })
        );
      }
    };

    handleAddToVisited();
  }, []);

  // Reset when product changes
  useEffect(() => {
    setRelated([]); // Clear related products
    setRelatedPage(0); // Reset related page counter
    setSimilar([]); // Clear similar products
    setSimilarPage(0); // Reset similar page counter
    alreadyFetchedPages.clear(); // Clear similar fetched pages
    alreadyFetchedPagesRelated.clear(); // Clear related fetched pages
  }, [product]);

  useEffect(() => {
    if (relatedInView) {
      const bringRelated = async () => {
        if (alreadyFetchedPagesRelated.has(relatedPage)) return;
        alreadyFetchedPagesRelated.add(relatedPage);
        setSimilarLoading(true);
        try {
          const response = await bringRelatedProducts(product, relatedPage);
          setRelated((prev) => [...prev, ...response]);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setSimilarLoading(false);
        }
      };
      bringRelated();
    }
  }, [relatedInView, relatedPage, product]);

  useEffect(() => {
    if (similarInView) {
      const bringSimilar = async () => {
        if (alreadyFetchedPages.has(similarPage)) return;
        alreadyFetchedPages.add(similarPage);
        setRelatedLoading(true);
        try {
          const response = await bringSimilarProducts(product, similarPage);
          setSimilar((prev) => [...prev, ...response]);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setRelatedLoading(false);
        }
      };
      bringSimilar();
    }
  }, [similarInView, similarPage, product]);

  const isMobile = useIsMobile(500);

  return (
    <>
      <Header country={country} />
      <div className={styles.product}>
        <div className={styles.path}>
          <Link href="/">Home</Link> /{" "}
          <Link
            href={{
              pathname: `/browse`,
              query: { category: product?.category?._id },
            }}
          >
            {product?.category?.name}
          </Link>
          {product.subCategories?.map((sub, i) => (
            <span key={i}>
              {" "}
              /{" "}
              <Link
                href={{
                  pathname: `/browse`,
                  query: {
                    category: product?.category?._id,
                    subcategory: sub?._id,
                  },
                }}
              >
                {sub.name}
              </Link>
            </span>
          ))}
          {product.subCategorie2?.map((sub, i) => (
            <span key={i}>
              {" "}
              /{" "}
              <Link
                href={{
                  pathname: `/browse`,
                  query: {
                    category: product?.category?._id,
                    subcategory: product?.subCategories?.[0]?._id,
                    subcategory2: sub?._id,
                  },
                }}
              >
                {sub.name}
              </Link>
            </span>
          ))}
          {product.subCategorie3?.map((sub, i) => (
            <span key={i}>
              {" "}
              /{" "}
              <Link
                href={{
                  pathname: `/browse`,
                  query: {
                    category: product?.category?._id,
                    subcategory: product?.subCategories?.[0]?._id,
                    subcategory2: product?.subCategorie2?.[0]?._id,
                    subcategory3: sub?._id,
                  },
                }}
              >
                {sub.name}
              </Link>
            </span>
          ))}
        </div>
        <div className={styles.product__container}>
          <div className={styles.product__main}>
            <div>
              {isMobile ? (
                <DynamicMobileSwiper images={product.images} />
              ) : (
                <DynamicMainSwiper
                  images={product.images}
                  activeImg={activeImg}
                />
              )}
            </div>
            <div>
              <Infos
                product={product}
                setActiveImg={setActiveImg}
                company={company}
              />
            </div>
          </div>
          <div className={styles.divider}></div>
          <div ref={similarRef}>
            <SimillarSwiper2
              products={similar}
              header="Productos similares"
              setSimilarPage={setSimilarPage}
              similarPage={similarPage}
              similarLoading={similarLoading}
            />
          </div>
          <div>
            <Reviews product={product} />
          </div>
        </div>
        <div className={styles.product__related} ref={relatedRef}>
          <ProductsSwiper
            products={related}
            header="Productos relacionados"
            setRelatedPage={setRelatedPage}
            relatedLoading={relatedLoading}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
