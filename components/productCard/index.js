import Link from "next/link";
import { useEffect, useState } from "react";
import ProductSwiper from "./ProductSwiper";
import styles from "./styles.module.scss";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export default function ProductCard({ product }) {
  const [active, setActive] = useState(0);
  const subProducts = product?.subProducts || [];
  const query530px = useMediaQuery({
    query: "(max-width:530px)",
  });

  const [images, setImages] = useState(
    subProducts[active]?.images || product?.images || []
  );
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
      setDiscount(subProducts[active].discount || 0);
    }
  }, [active, subProducts, product]);

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const originalPrice = prices.length > 0 ? prices[0] : 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  return (
    <div className={styles.product}>
      <div className={styles.product__container}>
        <Link
          href={
            subProducts?.sizes?.length > 1
              ? `/product/${product.slug}?style=${active}`
              : `/product/${product.slug}?style=${active}&size=0`
          }
          target={query530px ? null : "_blank"}
        >
          <div className={styles.product__border_line}>
            <ProductSwiper images={images} />
          </div>
        </Link>
        {discount > 0 && (
          <div className={styles.product__discount}>-{discount}%</div>
        )}
        <div className={styles.product__infos}>
          <div className={styles.product_name}>
            <span>
              {product?.name?.length > 45
                ? `${product?.name?.substring(0, 45)}...`
                : product?.name}
            </span>
          </div>

          <div className={styles.product_brand}>
            <span>
              Por{" "}
              {product?.company?.businessName?.length > 20
                ? `${product?.company?.businessName?.substring(0, 20)}...`
                : product?.company?.businessName}
            </span>
          </div>

          <div className={styles.product__colors}>
            {styless &&
              styless.map((style, i) =>
                style?.image ? (
                  <Image
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
                    alt={product.name}
                    width={300}
                    height={400}
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

          <div className={styles.product__stats_overview_rating}>
            <Rating
              name="half-rating-read"
              defaultValue={product.rating}
              value={product.rating}
              precision={0.5}
              readOnly
              style={{ color: "#FACF19" }}
              size="large"
              sx={{ border: "1px", width: "90px" }}
            />
            <span style={{ color: "#666" }}>
              {product.numReviews === 0 ? "(0)" : `(${product.numReviews})`}
            </span>
          </div>

          <div className={styles.product_price}>
            {discount > 0 ? (
              <>
                <p>
                  <del>${formatPrice(originalPrice)}</del>
                </p>
                <span>${formatPrice(discountedPrice)}</span>
              </>
            ) : (
              <span>${formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
