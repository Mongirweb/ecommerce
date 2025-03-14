export const validateEmail = (email) => {
  const regextSt =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regextSt.test(email);
};

export const validateCreateProduct = (
  product,
  images,
  subs2,
  subs3,
  shippingCost,
  sobreflete
) => {
  let sizes = product.sizes;
  let warranty = product.warranty;
  const checks = [
    {
      msg: "Nombre, descripción y marca agregados correctamente.",
      type: "success",
    },
  ];

  if (images.length <= 0) {
    checks.push({
      msg: `Elige al menos 3 imágenes (${3 - images.length} restantes).`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `${images.length} imágenes seleccionadas.`,
      type: "success",
    });
  }
  if (!product.color.color) {
    checks.push({
      msg: `Elige un color principal del producto.`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Color del producto seleccionado.`,
      type: "success",
    });
  }
  // if (!product.color.image) {
  //   checks.push({
  //     msg: `Elige una imagen de estilo del producto.`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Imagen de estilo del producto seleccionada.`,
  //     type: "success",
  //   });
  // }
  for (var i = 0; i < sizes.length; i++) {
    if (sizes[i].qty == "" || sizes[i].price == "" || sizes[i].size == "") {
      checks.push({
        msg: `Por favor completa toda la información en Precio / Cantidades.`,
        type: "error",
      });
      break;
    } else {
      checks.push({
        msg: `Se agregó al menos una talla/cantidad/precio/precio al por mayor.`,
        type: "success",
      });
    }
  }
  for (var i = 0; i < warranty.length; i++) {
    if (warranty[i].number == "" || warranty[i].time == "") {
      checks.push({
        msg: `Por favor completa toda la información en Garantía.`,
        type: "error",
      });
      break;
    } else {
      checks.push({
        msg: `Se agregó Garantía.`,
        type: "success",
      });
    }
  }
  if (!product.flashOffer) {
    checks.push({
      msg: `Aclarar particpipación en oferta flash.`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Participa o no en oferta flash.`,
      type: "success",
    });
  }
  if (product.flashOffer === "Si" && !product.flashDiscount) {
    checks.push({
      msg: `Si participas en oferta flash, debes ingresar un descuento.`,
      type: "error",
    });
  } else if (product.flashOffer === "Si" && product.flashDiscount) {
    checks.push({
      msg: `Descuento en oferta flash definido correctamente.`,
      type: "success",
    });
  } else if (product.flashOffer === "No") {
    checks.push({
      msg: `No participa en oferta flash.`,
      type: "success",
    });
  }

  // if (Number(product.discount) === Number(product.flashDiscount)) {
  //   checks.push({
  //     msg: `Descuento y descuento flash no puede ser iguales`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Descuentos diferenciados.`,
  //     type: "success",
  //   });
  // }

  // if (
  //   product.flashOffer === "Si" &&
  //   Number(product.flashDiscount) < Number(product.discount)
  // ) {
  //   checks.push({
  //     msg: `Descuento flash no puede ser menor a descuento`,
  //     type: "error",
  //   });
  // } else {
  //   checks.push({
  //     msg: `Descuento flash mayor a descuento.`,
  //     type: "success",
  //   });
  // }

  if (product.flashOffer === "No") {
    if (!product.flashDiscount) {
      checks.push({
        msg: `No participa en oferta flash`,
        type: "success",
      });
    } else {
      checks.push({
        msg: `No debería haber un descuento flash ya que no participa en oferta flash`,
        type: "error",
      });
    }
  }

  if (!product.genre) {
    checks.push({
      msg: `Producto no tiene genero`,
      type: "success",
    });
  }
  if (subs2.length > 0 && !product.subCategorie2) {
    checks.push({
      msg: `Debes Seleccionar Subcategoria # 2 del producto`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Subcategoria # 2 del producto seleccionada`,
      type: "success",
    });
  }
  if (subs3.length > 0 && !product.subCategorie3) {
    checks.push({
      msg: `Debes Seleccionar Subcategoria # 3 del producto`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Subcategoria # 3 del producto seleccionada`,
      type: "success",
    });
  }
  if (!product.flashOffer) {
    checks.push({
      msg: `Debes seleccionar si deseas participar en oferta flash`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Oferta Flash definida`,
      type: "success",
    });
  }
  if (product.flashOffer === "Si" && !product.flashDiscount) {
    checks.push({
      msg: `Si participas en oferta flash, debes ingresar un descuento`,
      type: "error",
    });
  } else {
    checks.push({
      msg: `Descuento flash definido`,
      type: "success",
    });
  }
  // for (var i = 0; i < details.length; i++) {
  //   if (details[i].name == "" || details[i].value == "") {
  //     checks.push({
  //       msg: `Por favor completa toda la información en detalles.`,
  //       type: "error",
  //     });
  //     break;
  //   } else {
  //     checks.push({
  //       msg: `Se agregó al menos un detalle.`,
  //       type: "success",
  //     });
  //   }
  // }
  // for (var i = 0; i < questions.length; i++) {
  //   if (questions[i].question == "" || details[i].answer == "") {
  //     checks.push({
  //       msg: `Por favor completa toda la información en preguntas.`,
  //       type: "success",
  //     });
  //     break;
  //   } else {
  //     checks.push({
  //       msg: `Se agregó al menos una pregunta.`,
  //       type: "success",
  //     });
  //   }
  // }
  // for (var i = 0; i < sizes.length; i++) {
  //   const chargeFlash = sizes[i].chargeFlashDiscount || 0;
  //   const charge = sizes[i].chargeDiscount || 0;
  //   const shipping = shippingCost || 0;
  //   const discountedPrice = sizes[i].discountedPrice || 0;
  //   const discountedFlashPrice = sizes[i].discountedFlashPrice || 0;
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
  var s_test = checks.find((c) => c.type === "error");
  if (s_test) {
    return checks;
  } else {
    return "valid";
  }
};
