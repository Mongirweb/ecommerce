import { useEffect, useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { sizesList } from "../../../data/sizes";
import styles from "./styles.module.scss";

export default function UpdateSizes({
  sizes,
  product,
  setProduct,
  index,
  shippingCost,
  setShippingCost,
  sobreflete,
  setSobreflete,
  sobrefleteFlash,
  setSobrefleteFlash,
}) {
  const [noSize, setNoSize] = useState(false);

  const handleSize = (i, e) => {
    const values = [...sizes];
    values[i][e.target.name] = e.target.value;

    // Calculate the price and apply discounts
    const price = parseFloat(values[i].price) || 0;
    let discountedPrice = price;

    if (
      product.subProducts[0]?.discount &&
      product.subProducts[0]?.discount > 0
    ) {
      // Assuming product.discount is a percentage (e.g., 10 for 10%)
      discountedPrice =
        price - price * (product.subProducts[0]?.discount / 100);
    }

    let discountedFlashPrice = price;
    if (
      product.subProducts[0]?.flashOffer &&
      product.subProducts[0]?.flashDiscount > 0
    ) {
      discountedFlashPrice =
        price - price * (product.subProducts[0]?.flashDiscount / 100);
    }

    const chargeDiscount = calculateCharge(discountedPrice);

    const chargeFlashDiscount = calculateCharge(discountedFlashPrice);

    // Add the calculated values to the size
    values[i].chargeFlashDiscount = chargeFlashDiscount;
    values[i].chargeDiscount = chargeDiscount;
    values[i].discountedPrice = discountedPrice;
    values[i].discountedFlashPrice = discountedFlashPrice;

    // Update the product with sizes and total values
    setProduct({
      ...product,
      sizes: values,
    });
  };

  // Function to format currency according to Colombian pesos
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = (i) => {
    if (product.subProducts[index]?.sold) {
      return;
    } else {
      setProduct((prevProduct) => {
        const newSubProducts = [...prevProduct.subProducts];
        const selectedSubProduct = { ...newSubProducts[index] };

        // Only allow removal if there is more than one size
        if (selectedSubProduct.sizes.length > 1) {
          selectedSubProduct.sizes = selectedSubProduct.sizes.filter(
            (_, sizeIndex) => sizeIndex !== i
          );
        }

        newSubProducts[index] = selectedSubProduct;

        return {
          ...prevProduct,
          subProducts: newSubProducts,
        };
      });
    }
  };

  const handleAddSize = () => {
    if (product.subProducts[index]?.sold) {
      return;
    } else {
      setProduct((prevProduct) => {
        const newSubProducts = [...prevProduct.subProducts];
        const selectedSubProduct = { ...newSubProducts[index] };

        selectedSubProduct.sizes = [
          ...selectedSubProduct.sizes,
          {
            size: "",
            qty: "",
            price: "",
          },
        ];

        newSubProducts[index] = selectedSubProduct;

        return {
          ...prevProduct,
          subProducts: newSubProducts,
        };
      });
    }
  };

  // Modify calculateCharge to return numerical value
  const calculateCharge = (price) => {
    return price * 0.1; // Returns number
  };

  const volumetricWeight = parseFloat(
    (
      (product?.subProducts[index]?.measures?.long *
        product?.subProducts[index]?.measures?.width *
        product?.subProducts[index]?.measures?.high) /
      2220
    ).toFixed(1)
  );

  const productWeight = Number(product?.subProducts[index]?.weight);

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
      // Calculate extra cost beyond 10 kg
      const extraKg = shippingWeight - 10;
      const baseCost = 18900; // "18.900" in numeric form
      const extraCostPerKg = 3400; // "3.400" in numeric form
      const totalCost = baseCost + extraCostPerKg * extraKg;

      // Format the result to a string with '.' as thousand separator
      const formattedCost = totalCost
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      setShippingCost(formattedCost);
    } else {
      setShippingCost("0");
    }
  }, [
    product?.subProducts[index]?.measures?.long,
    product?.subProducts[index]?.measures?.width,
    product?.subProducts[index]?.measures?.high,
    product?.subProducts[index]?.weight,
  ]);

  return (
    <div>
      <div className={styles.header}>
        Talla / Cantidad Stock / Precio Mayorista / Precio detal / SKU / Codigo
        de Barras
      </div>
      {sizes && sizes.length > 0
        ? sizes.map((size, i) => {
            const price = parseFloat(size.price) || 0;
            let discountedPrice = price;
            let flashDiscountPrice = price;
            if (
              product.subProducts[index].discount &&
              product.subProducts[index].discount > 0
            ) {
              // Assuming product.discount is a percentage
              discountedPrice =
                price - price * (product.subProducts[index].discount / 100);
            }
            if (
              product.subProducts[index].flashOffer &&
              product.subProducts[index].flashDiscount > 0
            ) {
              // Assuming product.discount is a percentage
              flashDiscountPrice =
                price -
                price * (product.subProducts[index].flashDiscount / 100);
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
                {sizes[index]?.size ? (
                  <select
                    name="size"
                    value={noSize ? "" : size.size}
                    disabled={noSize || product.subProducts[index]?.sold}
                    style={{ display: `${noSize ? "none" : ""}` }}
                    onChange={(e) => handleSize(i, e)}
                  >
                    <option value="">Tallas</option>
                    {sizesList.map((s) => (
                      <option value={s} key={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : null}

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
                  name="wholesalePrice"
                  placeholder={"Precio Mayorista"}
                  min={1}
                  value={`${size.wholesalePrice}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleSize(i, e);
                    }
                  }}
                  // disabled={product.subProducts[index]?.sold}
                />
                <input
                  type="number"
                  name="price"
                  placeholder={noSize ? "Precio detal" : "Precio Talla"}
                  min={1}
                  value={size.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleSize(i, e);
                    }
                  }}
                  // disabled={product.subProducts[index]?.sold}
                />
                <input
                  type="text"
                  name="sku"
                  placeholder={"SKU"}
                  min={1}
                  value={size.sku}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleSize(i, e);
                    }
                  }}
                  disabled={product.subProducts[index]?.sold}
                />
                <input
                  type="text"
                  name="universalCode"
                  placeholder={"Codigo Barras"}
                  min={1}
                  value={size.universalCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleSize(i, e);
                    }
                  }}
                  disabled={product.subProducts[index]?.sold}
                />
                {sizes[index]?.size ? (
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
            );
          })
        : null}

      {/* Move the "Agregar talla" button outside of the sizes.map() */}
      {sizes[index]?.size ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            marginTop: "10px", // Add some spacing from the list
          }}
          className={styles.addbutton}
        >
          <CiCirclePlus onClick={handleAddSize} />
          <span>Agregar talla</span>
        </div>
      ) : null}
    </div>
  );
}
