"use client";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

export default function SimilarCard({ product }) {
  const query450px = useMediaQuery({
    query: "(max-width:450px)",
  });
  const query690px = useMediaQuery({
    query: "(max-width:690px)",
  });
  const query991px = useMediaQuery({
    query: "(max-width:991px)",
  });
  const query1133px = useMediaQuery({
    query: "(max-width:1133px)",
  });
  const [active, setActive] = useState(0);

  const subProducts = product?.subProducts || [];

  const [images, setImages] = useState(
    subProducts[active]?.images || product?.images || []
  );
  const [prices, setPrices] = useState(
    subProducts[active]?.sizes?.map((s) => s.price).sort((a, b) => a - b) || []
  );
  const [styless, setStyless] = useState(subProducts.map((p) => p.color) || []);
  const [discount, setDiscount] = useState(subProducts[active]?.discount || 15);

  useEffect(() => {
    if (subProducts[active]) {
      setImages(subProducts[active].images || product?.images || []);
      setPrices(
        (subProducts[active].sizes || [])
          .map((s) => s.price)
          .sort((a, b) => a - b) || []
      );
      // setDiscount(subProducts[active].discount || 0);
      // setDiscount(Math.floor(Math.random() * 21) + 10);
    }
  }, [active, subProducts, product]);

  const formatPrice = (price) => {
    return price
      .toFixed(0) // Round to the nearest whole number
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add periods as thousands separators
  };

  const calculateDiscountedPrice = (price, discount) => {
    // const discountedPrice = price - (price * discount) / 100;
    const discountedPrice = price * (1 + discount / 100);
    return formatPrice(Math.round(discountedPrice));
  };

  const originalPrice = prices.length > 0 ? prices[0] : 0;
  const formattedOriginalPrice = formatPrice(Math.round(originalPrice));
  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

  const [randomStars] = useState(() => {
    return Math.floor(Math.random() * 1.5) + 4;
  });

  return (
    <div className={styles.product}>
      <div className={styles.product__container}>
        <a
          href={
            subProducts?.sizes?.length > 1
              ? `/product/${product.slug}?style=${active}`
              : `/product/${product.slug}?style=${active}&size=0`
          }
        >
          <div>
            <Image
              src={images?.[0]?.url}
              loading="lazy"
              width={500}
              height={300}
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
              blurDataURL={images?.[0]?.url}
              placeholder="blur"
            />
          </div>
        </a>
        {/* {discount > 0 && (
          <div className={styles.product__discount}>-{discount}%</div>
        )} */}
        <div className={styles.product__infos}>
          <div className={styles.product_name}>
            <span>
              {query450px
                ? product?.name?.length > 20
                  ? `${product?.name?.substring(0, 16)}...`
                  : product?.name
                : query690px
                ? product?.name?.length > 20
                  ? `${product?.name?.substring(0, 18)}...`
                  : product?.name
                : query991px
                ? product?.name?.length > 20
                  ? `${product?.name?.substring(0, 12)}...`
                  : product?.name
                : query1133px
                ? product?.name?.length > 20
                  ? `${product?.name?.substring(0, 18)}...`
                  : product?.name
                : product?.name?.length > 20
                ? `${product?.name?.substring(0, 18)}...`
                : product?.name}
            </span>
          </div>

          <div className={styles.product_brand}>
            <span>
              Por{" "}
              {product?.brand?.length > 20
                ? `${product?.brand?.substring(0, 20)}...`
                : product?.brand}
            </span>
          </div>

          <div className={styles.product__colors}>
            {styless &&
              styless.map((style, i) =>
                style?.image ? (
                  <img
                    key={i}
                    src={
                      style?.image ||
                      "https://res.cloudinary.com/danfiejkv/image/upload/v1737579212/product%20style%20images/tp7wbgkzhfjzmxy5f9rp.jpg"
                    }
                    className={i === active ? styles.active : ""}
                    onMouseOver={() => {
                      setImages(product?.subProducts[i]?.images);
                      setActive(i);
                    }}
                    alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                  />
                ) : (
                  <span
                    key={i}
                    style={{ backgroundColor: `${style?.color}` }}
                    onMouseOver={() => {
                      setImages(product?.subProducts[i]?.images);
                      setActive(i);
                    }}
                  ></span>
                )
              )}
          </div>

          <div className={styles.product_price}>
            {discount > 0 ? (
              <div className={styles.product_price_discount}>
                <div className={styles.product_price_discount_price}>
                  <span>${formattedOriginalPrice}</span>
                  <p>
                    <del>${discountedPrice}</del>
                  </p>
                </div>
                <div className={styles.product_add}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M0 1h4.764l3 11h10.515l3.089-9.265l1.897.633L19.72 14H7.78l-.5 2H22v2H4.72l1.246-4.989L3.236 3H0zm14 1v3h3v2h-3v3h-2V7H9V5h3V2zM4 21a2 2 0 1 1 4 0a2 2 0 0 1-4 0m14 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className={styles.product_price_nodiscount}>
                <span>$ {formattedOriginalPrice}</span>
                <div className={styles.product_add}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M0 1h4.764l3 11h10.515l3.089-9.265l1.897.633L19.72 14H7.78l-.5 2H22v2H4.72l1.246-4.989L3.236 3H0zm14 1v3h3v2h-3v3h-2V7H9V5h3V2zM4 21a2 2 0 1 1 4 0a2 2 0 0 1-4 0m14 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.product_rating}>
          <Rating
            name="half-rating-read"
            defaultValue={randomStars}
            precision={0.5}
            readOnly
            style={{ color: "black" }}
            size="large"
            sx={{ border: "1px", width: "90px" }}
          />
          {/* {product.numReviews > 0 && (
            <>
              ({product.numReviews}{" "}
              {product.numReviews === 1 ? "review" : "reviews"})
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}
