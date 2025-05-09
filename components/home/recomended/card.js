import Link from "next/link";
import styles from "./styles.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import { Rating } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

const RecomendedCard = React.memo(function RecomendedCard({
  product,
  firstRow = false, // pass true for the first on‑screen row
}) {
  const query690px = useMediaQuery({
    query: "(max-width:690px)",
  });
  const [active, setActive] = useState(0);

  const subProducts = useMemo(() => product?.subProducts || [], [product]);

  const [images, setImages] = useState(
    subProducts[active]?.images || product?.images || []
  );

  console.log(images);
  const [prices, setPrices] = useState(
    subProducts[active]?.sizes?.map((s) => s.price).sort((a, b) => a - b) || []
  );
  const [styless, setStyless] = useState(subProducts.map((p) => p.color) || []);
  const [discount, setDiscount] = useState(subProducts[active]?.discount || 0);

  useEffect(() => {
    if (subProducts[active]) {
      setImages(subProducts[active].images || product?.images || []);
      setPrices(
        (subProducts[active].sizes || [])
          .map((s) => s.price)
          .sort((a, b) => a - b) || []
      );
      setDiscount(Math.floor(Math.random() * 21) + 10);
    }
  }, [active, subProducts, product]);

  const formatPrice = (price) => {
    return price
      .toFixed(0) // Round to the nearest whole number
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add periods as thousands separators
  };

  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price * (1 + discount / 100);
    return formatPrice(Math.round(discountedPrice));
  };

  const originalPrice = prices.length > 0 ? prices[0] : 0;
  const formattedOriginalPrice = formatPrice(Math.round(originalPrice));
  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

  const randomStars = Math.floor(Math.random() * 1.5) + 4;
  const randomReviews = Math.floor(Math.random() * 80) + 1;

  return (
    <div className={styles.product}>
      <div className={styles.product__container}>
        <Link
          href={
            subProducts?.sizes?.length > 1
              ? `/product/${product.slug}?style=${active}`
              : `/product/${product.slug}?style=${active}&size=0`
          }
          target={query690px ? "_self" : "_blank"}
          prefetch={true}
        >
          <div>
            <Image
              width={200}
              height={200}
              src={images?.[0]?.url || ""}
              sizes="(max-width:450px) 45vw, (max-width:991px) 30vw, 200px"
              style={{ objectFit: "cover" }}
              priority={firstRow}
              alt="somoselhueco-recomendados-products-productos-saldos-saldo"
            />
          </div>
        </Link>

        <div className={styles.product__discount}>
          {/* mini‑llama de 24 px */}
          {/* <Image
            src="/images/llama-promo-producto_1.svg"
            width={24}
            height={24}
            alt="Oferta caliente"
            loading="lazy"
          /> */}
        </div>

        <div className={styles.product__infos}>
          <div className={styles.product_name}>
            <span>{product?.name}</span>
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
                  <Image
                    width={300}
                    height={200}
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
                    loading="lazy"
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
                  <Link
                    href={
                      subProducts?.sizes?.length > 1
                        ? `/product/${product.slug}?style=${active}`
                        : `/product/${product.slug}?style=${active}&size=0`
                    }
                    target="blank"
                    prefetch={true}
                  >
                    {" "}
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
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.product_price_nodiscount}>
                <span>$ {formattedOriginalPrice}</span>
                <div className={styles.product_add}>
                  <Link
                    href={
                      subProducts?.sizes?.length > 1
                        ? `/product/${product.slug}?style=${active}`
                        : `/product/${product.slug}?style=${active}&size=0`
                    }
                    target="blank"
                    prefetch={true}
                    aria-label={`View details of ${product.name}`}
                    title={`View details of ${product.name}`}
                  >
                    {" "}
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
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <Link
          href={
            subProducts?.sizes?.length > 1
              ? `/product/${product.slug}?style=${active}`
              : `/product/${product.slug}?style=${active}&size=0`
          }
          target={query690px ? "_self" : "_blank"}
          prefetch={true}
          className={styles.product__cta}
        >
          <div className={styles.product__cta_button}>
            <span>COMPRA AHORA</span>
          </div>
        </Link>
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
          {/* {randomReviews > 0 && <>({randomReviews})</>} */}
          {/* {product.numReviews > 0 && <>({product.numReviews})</>} */}
        </div>
      </div>
    </div>
  );
});
export default RecomendedCard;
