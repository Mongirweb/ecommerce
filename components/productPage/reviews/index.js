"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import AddReview from "./AddReview";
import Select from "./Select";
import styles from "./styles.module.scss";
import Table from "./Table";
import { Rating } from "@mui/material";
export default function Reviews({ product }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState(product?.reviews);

  return (
    <div className={styles.reviews}>
      <div className={styles.reviews__container}>
        <h1>Opiniones del producto ({product?.reviews?.length})</h1>
        <div className={styles.reviews__stats}>
          <div className={styles.reviews__stats_overview}>
            <span>Calificaciones</span>
            <div className={styles.reviews__stats_overview_rating}>
              <Rating
                name="half-rating-read"
                defaultValue={product?.rating}
                value={product?.rating}
                precision={0.5}
                readOnly
                style={{ color: "#FACF19" }}
                size="large"
                sx={{ border: "1px", width: "90px" }}
              />
              {product.rating == 0 ? "Sin Reseñas" : product.rating}
            </div>
          </div>
          <div className={styles.reviews__stats_reviews}>
            {product?.ratings?.map((rating, i) => (
              <div className={styles.reviews__stats_reviews_review} key={i}>
                <Rating
                  name="half-rating-read"
                  defaultValue={5 - i}
                  value={5 - i}
                  readOnly
                  style={{ color: "#FACF19" }}
                  sx={{ border: "1px", width: "90px" }}
                />
                <div className={styles.bar}>
                  <div
                    className={styles.bar__inner}
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span>{isNaN(rating.percentage) ? 0 : rating.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        {session ? (
          <AddReview product={product} setReviews={setReviews} />
        ) : (
          <button onClick={() => signIn()} className={styles.login_btn}>
            Ingresa para comentar
          </button>
        )}
        <Table
          reviews={reviews}
          allSizes={product.allSizes}
          colors={product.colors}
        />
      </div>
    </div>
  );
}
