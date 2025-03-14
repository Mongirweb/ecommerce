import { useEffect, useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { sizesList } from "../../../../data/sizes";
import styles from "./styles.module.scss";

export default function Sizes({
  sizes,
  product,
  setProduct,
  setShippingCost,
  sobreflete,
  shippingCost,
  setSobreflete,
  sobrefleteFlash,
  setSobrefleteFlash,
}) {
  const [noSize, setNoSize] = useState(false);
  const [customSize, setCustomSize] = useState(false);

  useEffect(() => {
    const updatedSizes = sizes.map((size) => {
      const price = parseFloat(size.price) || 0;
      let discountedPrice = price;

      if (product.discount && product.discount > 0) {
        discountedPrice = price - price * (product.discount / 100);
      }

      let discountedFlashPrice = price;
      if (product.flashOffer && product.flashDiscount > 0) {
        discountedFlashPrice = price - price * (product.flashDiscount / 100);
      }

      const chargeDiscount = calculateCharge(discountedPrice);
      const chargeFlashDiscount = calculateCharge(discountedFlashPrice);

      return {
        ...size,
        chargeDiscount,
        chargeFlashDiscount,
        discountedPrice,
        discountedFlashPrice,
      };
    });

    setProduct({ ...product, sizes: updatedSizes });
  }, [product.discount, product.flashDiscount]);

  const handleSize = (i, e) => {
    const values = [...sizes];
    values[i][e.target.name] = e.target.value;

    // Calculate the total charge when the price is updated
    const price = parseFloat(values[i].price) || 0;
    let discountedPrice = price;

    if (product.discount && product.discount > 0) {
      // Assuming product.discount is a percentage (e.g., 10 for 10%)
      discountedPrice = price - price * (product.discount / 100);
    }

    let discountedFlashPrice = price;
    if (product.flashOffer && product.flashDiscount > 0) {
      discountedFlashPrice = price - price * (product.flashDiscount / 100);
    }

    const chargeDiscount = calculateCharge(discountedPrice);
    const chargeFlashDiscount = calculateCharge(discountedFlashPrice);

    // Add the totalCharge to the corresponding size
    values[i].chargeFlashDiscount = chargeFlashDiscount;
    values[i].chargeDiscount = chargeDiscount;
    values[i].discountedPrice = discountedPrice;
    values[i].discountedFlashPrice = discountedFlashPrice;

    setProduct({ ...product, sizes: values });
  };

  const handleRemove = (i) => {
    if (sizes.length > 1) {
      const values = [...sizes];
      values.splice(i, 1);
      setProduct({ ...product, sizes: values });
    }
  };

  // Function to format currency according to Colombian pesos
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Modify calculateCharge to return numerical value
  const calculateCharge = (price) => {
    return price * 0.1; // Returns number
  };

  // Modify addExtraCharge to return numerical value
  const addExtraCharge = (price) => {
    return price < 60000 ? 3000 : 0; // Returns number
  };

  const volumetricWeight = parseFloat(
    (
      (product.measures.long * product.measures.width * product.measures.high) /
      2220
    ).toFixed(1)
  );

  const productWeight = Number(product.weight);

  useEffect(() => {
    const weightForShipping = () => {
      return Math.max(productWeight, volumetricWeight);
    };

    // Call the function to get the value
    const shippingWeight = weightForShipping();

    if (shippingWeight > 0 && shippingWeight <= 3) {
      setShippingCost(10000);
    } else if (shippingWeight > 3 && shippingWeight <= 6) {
      setShippingCost(14000);
    } else if (shippingWeight > 6 && shippingWeight <= 10) {
      setShippingCost(18900);
    } else if (shippingWeight > 10) {
      const extraKg = shippingWeight - 10;

      const extraFullKg = Math.ceil(extraKg);

      const totalCost = 18900 + 3400 * extraFullKg;

      setShippingCost(totalCost);
    } else {
      setShippingCost("0");
    }
  }, [
    product.measures.long,
    product.measures.width,
    product.measures.high,
    product.weight,
  ]);

  return (
    <div>
      <div
        className={styles.header}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        Talla / *Cantidad Stock / *Precio al detal / SKU / Código Barras
      </div>
      <>
        <button
          type="reset"
          className={styles.click_btn}
          style={{ marginRight: "10px" }}
          onClick={() => {
            if (!noSize) {
              let data = sizes.map((item) => {
                return {
                  qty: item.qty,
                  price: item.price,
                  sku: item.sku,
                  universalCode: item.universalCode,
                };
              });
              setProduct({ ...product, sizes: data });
            } else {
              let data = sizes.map((item) => {
                return {
                  size: item.size || "",
                  qty: item.qty,
                  price: item.price,
                  sku: item.sku,
                  universalCode: item.universalCode,
                };
              });
              setProduct({ ...product, sizes: data });
            }
            setNoSize((prev) => !prev);
          }}
        >
          {noSize
            ? "Click si el producto tiene tallas"
            : "Click si el producto no tiene tallas"}
        </button>
        <button
          className={styles.click_btn}
          onClick={() => setCustomSize((prev) => !prev)}
        >
          {customSize
            ? "Usar tallas predefinidas"
            : "Crear talla personalizada"}
        </button>
      </>

      {sizes
        ? sizes.map((size, i) => {
            const price = parseFloat(size.price) || 0;
            let discountedPrice = price;
            let flashDiscountPrice = price;

            if (product.discount && product.discount > 0) {
              // Assuming product.discount is a percentage
              discountedPrice = price - price * (product.discount / 100);
            }
            if (product.flashOffer && product.flashDiscount > 0) {
              // Assuming product.discount is a percentage
              flashDiscountPrice =
                price - price * (product.flashDiscount / 100);
            }

            // -----------------------------------------------
            // A) Flete Price for discounted price
            // -----------------------------------------------
            const computedFletePrice = discountedPrice * 0.01; // 1% of discounted price

            if (computedFletePrice <= 500) {
              setSobreflete(500);
            } else {
              setSobreflete(computedFletePrice);
            }

            // -----------------------------------------------
            // B) Flete Price for flash discount
            // -----------------------------------------------
            const computedFletePriceFlash = flashDiscountPrice * 0.01;

            if (computedFletePriceFlash <= 500) {
              setSobrefleteFlash(500);
            } else {
              setSobrefleteFlash(computedFletePriceFlash);
            }

            const charge = calculateCharge(discountedPrice);
            const chargeFlash = calculateCharge(flashDiscountPrice);

            const totalToCharge =
              Number(charge) + Number(shippingCost) + Number(sobreflete);

            const totalToChargeFlash =
              Number(chargeFlash) +
              Number(shippingCost) +
              Number(sobrefleteFlash);

            return (
              <div className={styles.clicktoadd} key={i}>
                <div className={styles.clicktoadd__inputs}>
                  {customSize ? (
                    // Render an input for custom size
                    <input
                      type="text"
                      name="size"
                      value={noSize ? "" : size.size}
                      disabled={noSize}
                      style={{ display: noSize ? "none" : "block" }}
                      onChange={(e) => handleSize(i, e)}
                      placeholder="Ej: 100cm x 160cm"
                    />
                  ) : (
                    // Render the original select dropdown
                    <select
                      name="size"
                      value={noSize ? "" : size.size}
                      disabled={noSize}
                      style={{ display: noSize ? "none" : "block" }}
                      onChange={(e) => handleSize(i, e)}
                    >
                      <option value="">Tallas</option>
                      {sizesList.map((s) => (
                        <option value={s} key={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    name="qty"
                    placeholder={
                      noSize ? "Cantidad Stock" : "Cantidad Stock Talla"
                    }
                    min={1}
                    value={size.qty}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // Allow only digits
                        handleSize(i, e);
                      }
                    }}
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder={noSize ? "Precio producto" : "Precio producto"}
                    min={1}
                    value={size.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // Allow only digits
                        handleSize(i, e);
                      }
                    }}
                  />
                  <input
                    type="text"
                    name="sku"
                    placeholder={"SKU"}
                    min={1}
                    value={size.sku}
                    onChange={(e) => {
                      // Allow only digits
                      handleSize(i, e);
                    }}
                  />
                  <input
                    type="text"
                    name="universalCode"
                    placeholder={"Codigo Barras"}
                    min={1}
                    value={size.universalCode}
                    onChange={(e) => {
                      // Allow only digits
                      handleSize(i, e);
                    }}
                  />
                  {!noSize ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CiCircleMinus onClick={() => handleRemove(i)} />
                      <div>Eliminar talla</div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        : null}
      {noSize ? (
        ""
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
          }}
          className={styles.adddetail}
        >
          <CiCirclePlus
            onClick={() => {
              setProduct({
                ...product,
                sizes: [
                  ...sizes,
                  {
                    size: "",
                    qty: "",
                    price: "",
                  },
                ],
              });
            }}
          />
          <span>Agregar talla</span>
        </div>
      )}
    </div>
  );
}
