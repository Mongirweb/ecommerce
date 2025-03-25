import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { TbEdit } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineDeleteForever } from "react-icons/md";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { hideDialog, showDialog } from "../../../../store/DialogSlice";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [copiedId, setCopiedId] = useState(""); // State to track copied ID

  const handleDeleteMyProduct = (productId, subProductId, cantDelete) => {
    // If the user can't delete, show the "can't delete" info dialog
    if (cantDelete) {
      dispatch(
        showDialog({
          header: "Producto no se puede eliminar",
          msgs: [
            {
              msg: (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div>
                    <div>
                      El producto no puede eliminarse por que ya ha sido
                      vendido.
                    </div>
                    <div>
                      Edita el producto y establece el stock en 0 si deseas que
                      el producto no sea vendido.
                    </div>
                  </div>
                </div>
              ),
              type: "info",
            },
          ],
          actions: [
            {
              label: "Cerrar",
              onClick: () => dispatch(hideDialog()),
            },
          ],
        })
      );
      return;
    }

    // Otherwise, show a "confirm delete" dialog
    dispatch(
      showDialog({
        header: "Confirmar eliminación",
        msgs: [
          {
            msg: (
              <div>
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
                <p>
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
            ),
            type: "warning",
          },
        ],
        actions: [
          {
            label: "Cancelar",
            onClick: () => dispatch(hideDialog()),
          },
          {
            label: "Eliminar",
            style: { backgroundColor: "red", color: "#fff" },
            onClick: async () => {
              try {
                // The actual delete request
                await axios.delete("/api/business/product/deleteProduct", {
                  data: { productId, subProductId },
                });
                // Hide dialog and refresh
                dispatch(hideDialog());
                toast.success("Producto eliminado con éxito");
                setTimeout(() => {
                  router.refresh();
                }, 1500);
              } catch (error) {
                console.error(error);
                dispatch(
                  showDialog({
                    header: "Error",
                    msgs: [
                      {
                        msg: `No se pudo eliminar el producto: ${error.message}`,
                        type: "error",
                      },
                    ],
                    actions: [
                      {
                        label: "Cerrar",
                        onClick: () => dispatch(hideDialog()),
                      },
                    ],
                  })
                );
              }
            },
          },
        ],
      })
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id); // Set the copied ID
      setTimeout(() => setCopiedId(""), 2000); // Clear the message after 2 seconds
    });
  };

  return (
    <div className={styles.product}>
      <h1 className={styles.product__name}>{product?.name}</h1>
      <h2 className={styles.product__category}>
        #{product?.category?.name} / {product?.subCategories[0]?.name} /{" "}
        {product?.subCategorie2 ? product?.subCategorie2[0]?.name : ""} /{" "}
        {product?.subCategorie3 ? product?.subCategorie3[0]?.name : ""}
      </h2>

      {product.subProducts.map((p, i) => {
        const cantDelete = p.sold > 0;
        return (
          <div className={styles.product__item} key={i}>
            <div className={styles.product__item_img}>
              <Image
                src={p?.images[0]?.url}
                alt="Mongir Logo"
                width={300}
                height={300}
                loading="lazy"
              />
            </div>
            <div className={styles.product__details}>
              <div>
                <span style={{ fontSize: "12px" }}>Id:</span>
                <span
                  style={{
                    fontSize: "10px",
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleCopyToClipboard(p._id)} // Copy ID on click
                >
                  {p._id}
                  {copiedId === p._id && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "green",
                        marginLeft: "5px",
                      }}
                    >
                      Copiado!
                    </span>
                  )}
                </span>
              </div>
              <span style={{ fontSize: "14px" }}>
                Stock: {p?.sizes[0]?.qty}
              </span>
              <span style={{ fontSize: "14px" }}>SKU: {p?.sizes[0]?.sku}</span>
              <span style={{ fontSize: "14px" }}>
                Variante:{" "}
                {p?.variant === "Default Title" ? "Normal" : p?.variant}
              </span>
              <span style={{ fontSize: "14px" }}>
                Precio : ${formatPrice(p?.sizes[0]?.price)}
              </span>
              <span style={{ fontSize: "14px" }}>
                Al por mayor: ${formatPrice(p?.sizes[0]?.wholesalePrice)}
              </span>
              {/* {p.flashOffer === "Si" ? (
                    <span style={{ fontSize: "14px" }}>
                      Precio descuento flash: $
                      {formatPrice(p?.sizes[0]?.priceWithDiscountFlash)}
                    </span>
                  ) : (
                    <span style={{ fontSize: "14px" }}>
                      Precio descuento flash: No participa
                    </span>
                  )} */}
            </div>
            <div className={styles.product__actions}>
              <Link
                href={`/business/dashboard/product/${product._id}?index=${i}`}
              >
                <TbEdit />
              </Link>
              <Link
                href={`/product/${product?.slug}?style=${i}&size=${0}`}
                style={{ color: "green" }}
                target="_blank"
              >
                <AiOutlineEye />
              </Link>
              <div
                style={{ color: "red" }}
                onClick={() =>
                  handleDeleteMyProduct(product._id, p._id, cantDelete)
                }
              >
                <MdOutlineDeleteForever />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
