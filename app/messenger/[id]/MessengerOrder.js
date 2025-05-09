"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../styles/messenger.module.scss";
import { toast } from "react-toastify";
import axios from "axios";
import dataURItoBlob from "../../../utils/dataURItoBlob";
import { uploadImages } from "../../../requests/upload";
import { useRouter } from "next/navigation";

export default function MessengerOrder({ session, order }) {
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState(order);
  const [packageCount, setPackageCount] = useState(
    selectedOrder?.inBagProductsInfos?.productsQty || ""
  );
  const [products, setProducts] = useState(selectedOrder.products);
  const [pickedImage, setPickedImages] = useState([]);
  const [deliveredImage, setDeliveredImage] = useState(
    Array.isArray(selectedOrder?.photoDelivered?.image)
      ? selectedOrder.photoDelivered.image
      : []
  );

  // NEW: loading state
  const [loading, setLoading] = useState(false);

  const productsQty = products.map((product) => product.qty);
  const totalQty = productsQty.reduce((a, b) => a + b, 0);

  const handleCollected = async (orderId, productIndex) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/messenger/messengerProductCollected",
        {
          orderId,
          productIndex,
        }
      );
      toast.success("Producto recogido");
      setSelectedOrder(data.order);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (ev) => {
        setPickedImages((images) => [...images, ev.target.result]);
      };
    });
  };

  const handleDeliveredImage = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (ev) => {
        setDeliveredImage((images) => [...images, ev.target.result]);
      };
    });
  };

  const handlePacked = async (orderId) => {
    // validations
    if (!pickedImage.length) {
      toast.error("Debes seleccionar una imagen");
      return;
    }
    if (!packageCount) {
      toast.error("Debes ingresar la cantidad de productos");
      return;
    }
    if (packageCount != totalQty) {
      toast.error("La cantidad de productos no coincide");
      return;
    }

    try {
      setLoading(true);
      let uploaded_image = [];
      if (pickedImage.length) {
        const path = "packaged_images";
        let formData = new FormData();
        formData.append("path", path);

        pickedImage.forEach((image) => {
          const blob = dataURItoBlob(image);
          formData.append("file", blob);
        });
        uploaded_image = await uploadImages(formData);
      }

      const { data } = await axios.post(
        "/api/messenger/messengerProductPacked",
        {
          orderId,
          uploaded_image,
          packageCount,
        }
      );
      toast.success("Productos empacados.");
      setProducts(data.order.products);
      setSelectedOrder(data.order);
      setPickedImages([]);
      setPackageCount("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelivered = async (orderId) => {
    if (!deliveredImage.length) {
      toast.error("Debes seleccionar una imagen");
      return;
    }
    setLoading(true);
    let uploaded_image = [];
    if (deliveredImage.length) {
      const path = "delivered_images";
      let formData = new FormData();
      formData.append("path", path);

      deliveredImage.forEach((image) => {
        const blob = dataURItoBlob(image);
        formData.append("file", blob);
      });
      uploaded_image = await uploadImages(formData);
    }

    try {
      const { data } = await axios.post(
        "/api/messenger/messengerProductDelivered",
        {
          orderId,
          uploaded_image,
        }
      );
      if (data.message === "Entregado a transportador") {
        setSelectedOrder(data.order);
        toast.success("Orden entregada");
        setTimeout(() => {
          router.push(`/messenger/`);
        }, 2000);
      } else {
        toast.error("Orden no entregada, intente de nuevo");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    ``;
  };

  const openLabel = async (orderId) => {
    const url = selectedOrder.trackingInfo.trackingLabel;
    if (!url) {
      console.error("URL no encontrada");
      return;
    }

    // Abre la URL en una nueva pestaña con los atributos de seguridad adecuados
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className={styles.messengerContainer}>
      {/* Loader Overlay */}
      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <Image
          src={session.user.image}
          alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
          width={80}
          height={80}
        />
        <h2>{session.user.name}</h2>
        <span>Opciones:</span>
      </div>

      {/* Orders Section */}
      <div className={styles.ordersContainer}>
        <div key={selectedOrder._id} className={styles.orderCard}>
          <h3>Pedido ID: {selectedOrder._id}</h3>
          <p>Guía ID: {selectedOrder?.trackingInfo?.trackingNumber || "N/A"}</p>
          <p>
            Estado:{" "}
            <span
              className={
                selectedOrder.messengerStatus === "En proceso de empacar" ||
                selectedOrder.messengerStatus === "Empacado" ||
                selectedOrder.messengerStatus === "Entregado a transportador"
                  ? styles.open
                  : styles.closed
              }
            >
              {selectedOrder.messengerStatus}
            </span>
          </p>
          <p>Cantidad Productos: {selectedOrder.products.length}</p>

          {selectedOrder.products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <div className={styles.productHeader}>
                <h4>Producto</h4>
                <span
                  className={
                    product.status === "Recogido"
                      ? styles.collected
                      : styles.pending
                  }
                >
                  {product.status}
                </span>
              </div>
              <div className={styles.productDetails}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                />
                <div>
                  <p>{product.name}</p>
                  <p>
                    <strong>Cantidad:</strong> {product.qty}
                  </p>
                  <p>
                    <strong>Variante:</strong> {product.variant}
                  </p>
                  {product?.size && (
                    <p>
                      <strong>Talla:</strong> {product.size}
                    </p>
                  )}
                  <p>
                    <strong>SKU:</strong> {product.sku}
                  </p>
                  <p>
                    <strong>Empresa:</strong> {product.companyName}
                  </p>
                </div>
              </div>

              <button
                className={`${styles.markCollected} ${
                  product.pickedUp ? styles.markCollected__pickedUp : ""
                }`}
                onClick={() => {
                  if (!product.pickedUp && !loading) {
                    handleCollected(selectedOrder._id, index);
                  }
                }}
                type="button"
                disabled={product.pickedUp || loading}
              >
                {product.pickedUp ? "Recogido" : "Marcar como Recogido"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Packing Section */}
      <div className={styles.packingSection}>
        <h3>Ahora empaca los productos</h3>
        <label>
          <strong>Sube foto donde se vean los productos en el empaque</strong>
          <input
            type="file"
            onChange={(e) => handleImages(e)}
            disabled={selectedOrder.messengerStatus !== "En proceso de empacar"}
          />
          <div className={styles.imagePreview}>
            <Image
              src={pickedImage[0] || selectedOrder?.inBagProductsInfos?.image}
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
              width={200}
              height={200}
            />
          </div>
        </label>

        <label>
          <strong>¿Cuántos productos hay en el empaque?</strong>
          <input
            type="number"
            value={packageCount}
            onChange={(e) => setPackageCount(e.target.value)}
            placeholder="Numero de productos en el empaque"
            disabled={selectedOrder.messengerStatus !== "En proceso de empacar"}
          />
        </label>
        <button
          className={`${styles.packageButton} ${
            selectedOrder.messengerStatus === "En proceso de empacar"
              ? styles.notPacked
              : styles.packed
          }`}
          type="button"
          onClick={() => {
            if (!loading) handlePacked(selectedOrder._id);
          }}
          disabled={
            selectedOrder.messengerStatus !== "En proceso de empacar" || loading
          }
        >
          {selectedOrder.messengerStatus === "En proceso de empacar"
            ? "Empacar"
            : "Paquete empacado"}
        </button>
      </div>

      {/* label Section */}

      <div className={styles.shipmentSection}>
        <h3>Imprime etiqueta de envío</h3>

        <button
          className={`${styles.shipmentButton} `}
          type="button"
          disabled={loading}
          onClick={() => {
            openLabel(selectedOrder._id);
          }}
        >
          Ver etiqueta
        </button>
      </div>

      {/* Shipment Section */}
      <div className={styles.shipmentSection}>
        <h3>Ahora envía los productos</h3>
        <label>
          <strong>Sube foto del empaque sellado con la guía impresa</strong>
          <input
            type="file"
            onChange={(e) => handleDeliveredImage(e)}
            disabled={
              selectedOrder.messengerStatus === "Entregado a transportador"
            }
          />
          <div className={styles.imagePreview}>
            {deliveredImage?.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                width={200}
                height={200}
              />
            ))}
          </div>
        </label>
        <button
          className={`${styles.shipmentButton} ${
            selectedOrder?.messengerStatus !== "Entregado a transportador"
              ? styles.delivered
              : styles.packed
          }`}
          type="button"
          onClick={() => {
            if (!loading) handleDelivered(selectedOrder._id);
          }}
          disabled={
            selectedOrder?.messengerStatus === "Entregado a transportador" ||
            loading
          }
        >
          {selectedOrder?.messengerStatus === "Entregado a transportador"
            ? "Entregado"
            : "Marcar como Enviado"}
        </button>
      </div>
    </div>
  );
}
