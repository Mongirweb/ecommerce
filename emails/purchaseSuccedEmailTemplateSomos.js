export const purchaseSuccedEmailTemplate = ({
  orderNumber,
  name,
  products,
  total,
  shippingAddress,
  shipping,
  trackingUrl,
}) => {
  // Build product rows dynamically
  const productRows = products
    .map(
      (product) => `
        <tr>
          <!-- Imagen del producto -->
          <td align="center" valign="middle" style="width:25%; padding:10px; border: 1px solid #ddd;">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              style="max-width:70px; height:70px; object-fit:cover; border-radius:5px; display:block;" 
            />
          </td>
          <!-- Nombre del producto y cantidad -->
          <td align="left" valign="middle" style="width:30%; padding:10px; font-family:Arial, sans-serif; font-size:14px; line-height:20px; color:#333; border: 1px solid #ddd;">
            <strong>${product.name}</strong>
            <br />
            Cantidad: ${product.qty}
          </td>
          <!-- Precio unitario -->
          <td align="right" valign="middle" style="width:20%; padding:10px; border: 1px solid #ddd; font-family:Arial, sans-serif; font-size:14px;">
            $${product.price.toLocaleString("es-CO")}
          </td>
          <!-- Subtotal (qty * price) -->
          <td align="right" valign="middle" style="width:25%; padding:10px; border: 1px solid #ddd; font-family:Arial, sans-serif; font-size:14px;">
            $${(product.qty * product.price).toLocaleString("es-CO")}
          </td>
        </tr>
      `
    )
    .join("");

  // Return the full email HTML
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <!--<![endif]-->
  <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
  <![endif]-->
  <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
      body {width: 600px;margin: 0 auto;}
      table {border-collapse: collapse;}
      table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
      img {-ms-interpolation-mode: bicubic;}
    </style>
  <![endif]-->
  <style type="text/css">
    body,
    p,
    div {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      color: #000000;
    }
    a {
      color: #1188E6;
      text-decoration: none;
    }
    p {
      margin: 0;
      padding: 0;
    }
    table.wrapper {
      width: 100% !important;
      table-layout: fixed;
    }
    img.max-width {
      max-width: 80% !important;
    }
    .column {
      width: 33.333%;
      display: inline-block;
      vertical-align: top;
      text-align: center;
    }
    .image-container {
      flex-wrap: nowrap;
      justify-content: center;
    }
    .image-container img {
      flex: 0 0 auto;
      margin: 0 auto;
    }
    .module-1 {
      width: 40%;
    }
    @media screen and (max-width: 480px) {
      .image-container {
        flex-wrap: nowrap;
        justify-content: center;
      }
      .column {
        width: auto;
        display: inline-block;
      }
      .image-container img {
        flex: 0 0 auto;
        margin: 0 auto;
      }
      .module-1 {
        width: 60%;
      }
    }
    /* Additional custom styles for the product table */
    .product-table {
      max-width: 600px;
      margin: 0 auto;
      border-collapse: collapse;
    }
    .product-table th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .product-table, 
    .product-table th,
    .product-table td {
      border: 1px solid #ddd;
    }
    .total-row {
      font-weight: bold;
      background-color: #f9f9f9;
    }
  </style>
</head>

<body>
  <center class="wrapper" data-link-color="#1188E6"
    data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
    <div class="webkit">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
        <tr>
          <td valign="top" bgcolor="#FFFFFF" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="100%">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <!--[if mso]>
                        <center>
                          <table><tr><td width="600">
                        <![endif]-->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                          style="width:100%; max-width:600px;" align="center">
                          <tr>
                            <td role="modules-container"
                              style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF"
                              width="100%" align="left">
                              
                              <!-- Preheader (hidden) -->
                              <table class="module preheader preheader-hide" role="module" data-type="preheader"
                                border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                <tr>
                                  <td role="module-content">
                                    <p> </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <!-- Logo + "Pedido confirmado" Header -->
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF"
                                data-distribution="1,1">
                                <tbody>
                                  <tr role="module-content">
                                    <td height="100%" valign="top">
                                      <!-- Logo Column -->
                                      <table width="290"
                                        style="width:290px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-0">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table class="wrapper" role="module" data-type="image" border="0"
                                                cellpadding="0" cellspacing="0" width="100%"
                                                style="table-layout: fixed;" data-muid="r2LZvbS8XR4Q747hgVZE7h">
                                                <tbody>
                                                  <tr>
                                                    <td style="font-size:6px; line-height:10px; padding:10px 10px 0px 10px;"
                                                      valign="top" align="left">
                                                      <a href="https://www.somoselhueco.com/">
                                                        <img class="max-width" border="0"
                                                          style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;"
                                                          width="87" alt="Somos El Hueco Logo"
                                                          data-proportionally-constrained="true" data-responsive="true"
                                                          src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/a7f5770b-0d45-4e2e-aaf0-958aae8b11ec/324x324.png" />
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                      <!-- "Pedido confirmado" Text Column -->
                                      <table width="290"
                                        style="width:290px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-1">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table class="module" role="module" data-type="text" border="0"
                                                cellpadding="0" cellspacing="0" width="100%"
                                                style="table-layout: fixed;"
                                                data-muid="dJWTTz97S1HhqGKdxNZa2e"
                                                data-mc-module-version="2019-10-22">
                                                <tbody>
                                                  <tr>
                                                    <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;"
                                                      height="100%" valign="top" bgcolor="" role="module-content">
                                                      <div>
                                                        <h2 style="text-align: center">
                                                          <span style="color: #bababa; font-size: 18px; font-family: arial, helvetica, sans-serif">
                                                            Pedido confirmado
                                                          </span>
                                                        </h2>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Main text and dynamic fields -->
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="4399d907-f42c-4aca-b266-6499ccb3c792" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 10px 18px 10px; line-height:22px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: Arial, Helvetica, sans-serif;">
                                        <p style="font-size: 18px; margin: 0; text-align: justify;">
                                          Hola <strong>${name}</strong>,
                                        </p>
                                        <br />
                                        <p style="font-size: 18px; margin: 0; text-align: justify;">
                                          ¡Tu pedido está confirmado! Estamos preparándolo y te notificaremos cuando se envíe.
                                        </p>
                                        <br />
                                        <p style="font-size: 18px; margin: 0; text-align: justify;">
                                          <strong>Número de pedido:</strong> ${orderNumber}
                                        </p>
                                        <br />
                                        <!-- Product Table -->
                                        <div style="margin-top:20px;">
                                          <table class="product-table" border="0" cellpadding="0" cellspacing="0"
                                            align="center" width="100%" style="max-width:600px; margin: 0 auto;">
                                            <thead>
                                              <tr>
                                                <th style="text-align:center; padding:10px;">Imagen</th>
                                                <th style="padding:10px;">Producto</th>
                                                <th style="text-align:right; padding:10px;">Precio Unitario</th>
                                                <th style="text-align:right; padding:10px;">Total</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <!-- Shipping Row -->
                                              
                                              ${productRows}
                                              <tr class="total-row">
                                                <td colspan="3" style="text-align: right; padding: 10px;">
                                                  Envío:
                                                </td>
                                                <td style="text-align: right; padding: 10px;">
                                                  $${shipping.toLocaleString(
                                                    "es-CO"
                                                  )}
                                                </td>
                                              </tr>
                                              <!-- Total Row -->
                                              <tr class="total-row">
                                                <td colspan="3" style="text-align: right; padding: 10px;">
                                                  Total del Pedido:
                                                </td>
                                                <td style="text-align: right; padding: 10px;">
                                                  $${total.toLocaleString(
                                                    "es-CO"
                                                  )}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                        <!-- Shipping address -->
                                        <br />
                                        <p style="font-size: 18px; margin: 0; text-align: justify;">
                                          <strong>Dirección de envío:</strong>
                                          ${shippingAddress.address1}, ${
    shippingAddress.city
  }, ${shippingAddress.state}, ${shippingAddress.country}
                                        </p>
                                        <br />
                                        <p style="font-size: 18px; margin: 0; text-align: justify;">
                                          <strong>Reastrea tu pedido:</strong>
                                          <a href="${trackingUrl}"
                                                style=""
                                                target="_blank">Ver Estado de Envío</a>
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Spacer -->
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="9e43bca3-04d6-4b0d-856b-44f0166e8a11">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Button: Ir a Mis Pedidos -->
                              <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button"
                                data-type="button" role="module" style="table-layout:fixed;" width="100%"
                                data-muid="e78d2768-5ea7-4a89-87a0-c40b396e5ac1">
                                <tbody>
                                  <tr>
                                    <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                                      <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile"
                                        style="text-align:center;">
                                        <tbody>
                                          <tr>
                                            <td align="center" bgcolor="#3ab3ff" class="inner-td"
                                              style="border-radius:6px; font-size:16px; text-align:center;">
                                              <a href="https://www.somoselhueco.com/myprofile/orders"
                                                style="background-color:#3ab3ff; border:1px solid #3ab3ff; border-color:#3ab3ff; border-radius:50px; border-width:1px; color:#ffffff; display:inline-block; font-size:18px; font-weight:700; letter-spacing:0px; line-height:normal; padding:12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:arial,helvetica,sans-serif;"
                                                target="_blank">Ir a Mis Pedidos</a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Spacer -->
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="7a40eb7d-4f65-49de-9996-7c4d7cabf087.1">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Follow us -->
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="4399d907-f42c-4aca-b266-6499ccb3c792.1"
                                data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 10px 18px 10px; line-height:22px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
                                        <span style="font-size: 18px;">
                                          Síguenos en:
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Social media icons -->
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                role="module" data-type="columns" style="padding:30px 10px 30px 10px;" bgcolor="#FFFFFF"
                                data-distribution="1,1,1">
                                <tbody>
                                  <tr role="module-content">
                                    <td height="100%" valign="top">
                                      <table class="module-1" role="module" data-type="image" border="0" cellpadding="0"
                                        cellspacing="0" style="margin: 20px auto; text-align: center;">
                                        <tr>
                                          <td style="text-align: center;">
                                            <div class="image-container"
                                              style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                                              <!-- Facebook -->
                                              <div class="column">
                                                <a href="https://www.facebook.com/profile.php?id=61555759280981">
                                                  <img
                                                    src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/5902be93-8ab7-4c9a-9281-b365b278a768/451x449.png"
                                                    alt="Facebook" class="max-width" style="width: 100%;" />
                                                </a>
                                              </div>
                                              <!-- Instagram -->
                                              <div class="column">
                                                <a href="https://www.instagram.com/somoselhuecomedellin/?hl=es">
                                                  <img
                                                    src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/d3ea041a-7019-461b-b304-671da48995a7/450x449.png"
                                                    alt="Instagram" class="max-width" style="width: 100%;" />
                                                </a>
                                              </div>
                                              <!-- Tiktok -->
                                              <div class="column">
                                                <a href="https://www.tiktok.com/@somoselhueco">
                                                  <img
                                                    src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/e0ab277f-536b-4429-b4f6-6b94d0daaf22/452x450.png"
                                                    alt="Tiktok" class="max-width" style="width: 100%;" />
                                                </a>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Spacer -->
                              <table class="module" role="module" data-type="spacer" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="d384bfa7-0c8c-4d00-b5ec-1e5abd25d452">
                                <tbody>
                                  <tr>
                                    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Footer banner -->
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module"
                                style="padding:0; margin:0; background-color:#FFFFFF;">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="top" style="padding:0; margin:0;">
                                      <a href="https://www.somoselhueco.com" target="_blank" style="display:block;">
                                        <img
                                          src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/49ca3146-2be2-4f9a-a861-b8bd4bda1eb1/800x200.png"
                                          alt="Encabezado"
                                          style="display:block; width:100%; max-width:600px; height:auto; margin:0; padding:0;" />
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Note -->
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="4399d907-f42c-4aca-b266-6499ccb3c792.2"
                                data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 10px 18px 10px; line-height:22px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
                                        <p style="font-size: 18px;">
                                          NOTA: Este es un email generado automáticamente, no lo respondas.
                                        </p>
                                        <p style="font-size: 18px;">
                                          Contáctanos si tienes alguna pregunta.
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Legal links -->
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module"
                                style="padding:0px 0px 0px 0px; text-align: center;" bgcolor="#FFFFFF">
                                <tbody>
                                  <tr>
                                    <td align="center" style="padding: 20px 0;">
                                      <table border="0" cellpadding="0" cellspacing="0" align="center"
                                        style="text-align: center;">
                                        <tr>
                                          <td style="padding: 0 10px;">
                                            <a href="https://www.somoselhueco.com/terms"
                                              style="color: #000000; text-decoration: none;">
                                              <span style="font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                                                <u>Términos y condiciones</u>
                                              </span>
                                            </a>
                                          </td>
                                          <td style="padding: 0 10px;">
                                            <a href="https://www.somoselhueco.com/privacy"
                                              style="color: #000000; text-decoration: none;">
                                              <span style="font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                                                <u>Política de Privacidad</u>
                                              </span>
                                            </a>
                                          </td>
                                          <td style="padding: 0 10px;">
                                            <a href="https://www.somoselhueco.com/clientWhatsApp"
                                              style="color: #000000; text-decoration: none;">
                                              <span style="font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                                                <u>Contáctanos</u>
                                              </span>
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Address / unsubscribe -->
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="4399d907-f42c-4aca-b266-6499ccb3c792.2.1"
                                data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 10px 10px 10px; line-height:22px; text-align:inherit;"
                                      height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
                                        <span style="font-size: 14px;">
                                          Somos El Hueco - Medellín, Colombia
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe"
                                style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;"
                                data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                                <div class="Unsubscribe--addressLine"></div>
                                <p style="font-size:12px; line-height:20px;">
                                  <a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="">
                                    Unsubscribe
                                  </a>
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                            </td>
                          </tr>
                        </table>
                      </center>
                        <![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
`;
};
