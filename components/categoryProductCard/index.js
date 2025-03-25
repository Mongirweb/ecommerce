import Link from "next/link";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { Rating } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

export default function RecomendedCard({ product }) {
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

  const formatPrice = (price) => {
    return price
      .toFixed(0) // Round to the nearest whole number
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add periods as thousands separators
  };

  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return formatPrice(Math.round(discountedPrice));
  };

  const originalPrice = prices.length > 0 ? prices[0] : 0;
  const formattedOriginalPrice = formatPrice(Math.round(originalPrice));
  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

  return (
    <div className={styles.product}>
      <div className={styles.product__container}>
        <Link
          href={
            subProducts?.sizes?.length > 1
              ? `/product/${product.slug}?style=${active}`
              : `/product/${product.slug}?style=${active}&size=0`
          }
          prefetch={true}
        >
          <div>
            <Image
              width={200}
              height={300}
              alt="Mongir Logo"
              src={images?.[0]?.url}
              loading="lazy"
            />
          </div>
        </Link>
        {discount > 0 && (
          <div className={styles.product__discount}>-{discount}%</div>
        )}
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
                ? `${product?.name?.substring(0, 17)}...`
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
                  <Image
                    width={300}
                    height={300}
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
                    loading="lazy"
                    alt="Mongir Logo"
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
                  <span>$ {discountedPrice}</span>
                  <p>
                    <del>${formattedOriginalPrice}</del>
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
                    <MdAddShoppingCart />
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
                    <MdAddShoppingCart />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.product_rating}>
          <Rating
            name="half-rating-read"
            defaultValue={product?.rating}
            precision={0.5}
            readOnly
            style={{ color: "#FACF19" }}
            size="large"
            sx={{ border: "1px", width: "90px" }}
          />
          {product.numReviews > 0 && <>({product.numReviews} )</>}
        </div>
      </div>
    </div>
  );
}
