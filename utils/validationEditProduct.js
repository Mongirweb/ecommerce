/**
 * Validate a single subProduct at `index` inside `product`.
 *
 * @param {Object} product - The full product object.
 * @param {Number} shippingCost - The shipping cost for calculations.
 * @param {Number} sobreflete - The "sobreflete" cost.
 * @param {Number} index - Which subProduct to validate (from product.subProducts).
 * @returns {String | Array} - "valid" if everything passes, or an array of checks with success/error messages.
 */
export const validateEditProduct = (
  product,
  shippingCost,
  sobreflete,
  index = 0
) => {
  // We'll store any messages (success/error) in this array:
  const checks = [];

  // 1) Basic top-level check (name/description/brand) if needed:
  if (!product.name || !product.description) {
    checks.push({
      msg: "Asegúrate de que el producto tenga nombre y descripción.",
      type: "error",
    });
  } else {
    checks.push({
      msg: "Nombre y descripción agregados correctamente.",
      type: "success",
    });
  }

  // 2) Ensure subProducts is an array and the specified index exists:
  if (!Array.isArray(product.subProducts) || !product.subProducts[index]) {
    checks.push({
      msg: `No existe un subProduct en el índice ${index}.`,
      type: "error",
    });
    return checks;
  }

  // 3) Grab the subProduct you’re validating
  const subProduct = product.subProducts[index];

  // ---------------------
  // Validate subProduct fields
  // ---------------------

  // 3a) Color
  if (!subProduct.color?.color) {
    checks.push({
      msg: `Elige un color principal para el subProduct.`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Color del subProduct seleccionado.`,
      type: "success",
    });
  }

  // // 3b) Discount
  // if (subProduct.discount == null || subProduct.discount === "") {
  //   checks.push({
  //     msg: `Por favor especifica un descuento (subProduct.discount).`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Descuento del subProduct: ${subProduct.discount}%.`,
  //     type: "success",
  //   });
  // }

  // 3c) Flash Offer
  if (!subProduct.flashOffer) {
    checks.push({
      msg: `Selecciona si participa en oferta flash (subProduct.flashOffer).`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Participa en oferta flash: ${subProduct.flashOffer}.`,
      type: "success",
    });
  }

  // 3d) Flash Discount
  if (subProduct.flashOffer === "Si" && !subProduct.flashDiscount) {
    checks.push({
      msg: `Si participas en oferta flash, debes ingresar un flashDiscount.`,
      type: "error",
    });
  } else if (subProduct.flashOffer === "Si" && subProduct.flashDiscount) {
    checks.push({
      msg: `Descuento en oferta flash definido correctamente.`,
      type: "success",
    });
  } else if (subProduct.flashOffer === "No") {
    // If flashOffer is "No" but there's a flashDiscount, that's an error
    if (subProduct.flashDiscount) {
      checks.push({
        msg: `No debería haber flashDiscount si no participa en oferta flash.`,
        type: "error",
      });
    } else {
      checks.push({
        msg: `No participa en oferta flash (correcto).`,
        type: "success",
      });
    }
  }

  // // 3e) Compare discount vs. flashDiscount
  // if (
  //   Number(subProduct.discount) === Number(subProduct.flashDiscount) &&
  //   subProduct.flashOffer === "Si"
  // ) {
  //   checks.push({
  //     msg: `El descuento normal y flash no pueden ser iguales.`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Descuentos diferenciados (normal vs flash).`,
  //     type: "success",
  //   });
  // }

  // if (
  //   subProduct.flashOffer === "Si" &&
  //   Number(subProduct.flashDiscount) < Number(subProduct.discount)
  // ) {
  //   checks.push({
  //     msg: `Descuento flash no puede ser menor que el descuento normal.`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Flash discount en orden.`,
  //     type: "success",
  //   });
  // }

  // 3f) Sizes

  // for (var i = 0; i < subProduct.sizes.length; i++) {
  //   const chargeFlash = subProduct.sizes[i].chargeFlashDiscount;
  //   const charge = subProduct.sizes[i].chargeDiscount;
  //   const shipping = shippingCost || 0;
  //   const discountedPrice = subProduct.sizes[i].discountedPrice || 0;
  //   const discountedFlashPrice = subProduct.sizes[i].discountedFlashPrice || 0;
  //   const costosFlash = chargeFlash + shipping + sobreflete;
  //   const costosNormal = charge + shipping + sobreflete;
  //   const recibirFlash = discountedFlashPrice - costosFlash;
  //   const recibirNormal = discountedPrice - costosNormal;

  //   if (recibirFlash <= 0) {
  //     checks.push({
  //       msg: `No se pueden cargar productos con utilidades igual o menor a $0`,
  //       type: "error",
  //     });
  //     break;
  //   } else if (recibirNormal <= 0) {
  //     checks.push({
  //       msg: `No se pueden cargar productos con utilidades igual o menor a $0`,
  //       type: "error",
  //     });
  //     break;
  //   } else {
  //     checks.push({
  //       msg: `Los productos cargados generan utilidad`,
  //       type: "success",
  //     });
  //   }
  // }

  // 3g) Warranty
  // If warranty is an array of objects
  if (Array.isArray(subProduct.warranty) && subProduct.warranty.length) {
    for (let i = 0; i < subProduct.warranty.length; i++) {
      const w = subProduct.warranty[i];
      if (!w.number || !w.time) {
        checks.push({
          msg: `Por favor completa toda la información de Garantía (elemento ${
            i + 1
          }).`,
          type: "error",
        });
        break;
      } else {
        checks.push({
          msg: `Garantía ${i + 1} agregada correctamente.`,
          type: "success",
        });
      }
    }
  } else {
    // Possibly no warranties or single object. Adjust as needed.
    checks.push({
      msg: `Garantía no definida o no es un array (verifica si es necesario).`,
      type: "info",
    });
  }

  // Finally, decide if we have an error
  const foundError = checks.find((c) => c.type === "error");
  return foundError ? checks : "valid";
};
