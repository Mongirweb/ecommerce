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
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

  <style type="text/css">
    body, p, div, span, a, h1, h2, h3 {
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
      margin: 0;
      padding: 0;
    }
    table.wrapper {
      width: 100% !important;
      table-layout: fixed;
    }
    img.max-width {
      max-width: 100% !important;
      height: auto !important;
    }
    a {
      color: #1188E6;
      text-decoration: none;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .product-table th {
      background-color: #f4f4f4;
      padding: 10px;
      text-align: left;
    }
    .product-table td {
      padding: 10px;
      border: 1px solid #ddd;
    }
    .total-row {
      font-weight: bold;
      background-color: #f9f9f9;
    }
    .cta-button {
      background-color: #142D4A;
      color: white !important;
      padding: 12px 25px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .product-table td, .product-table th {
        padding: 8px;
        font-size: 14px;
      }
      .cta-button {
        padding: 10px 20px;
      }
    }
  </style>
</head>

<body style="background-color:#FFFFFF;">
  <center class="wrapper">
    <div class="webkit">
      <table class="wrapper" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <div class="container">

              <!-- Logo Header -->
              <div style="padding: 20px; text-align: center;">
                <a href="https://www.mongir.com/">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/12f6ec65-5670-4137-af41-f318e7165c25/323x112.png" 
                       alt="Mongir Logo" width="200">
                </a>
                <h2 style="color: #bababa; margin-top: 10px;">Pedido confirmado</h2>
              </div>

              <!-- Order Details -->
              <div style="padding: 20px; text-align: left;">
                <p>Hola {{ name }}. ¡Tu pedido está confirmado! Estamos preparándolo y te notificaremos cuando se envíe.</p>
                <p style="margin: 15px 0;"><strong>Número de pedido: {{ orderNumber }}</strong></p>

                <!-- Product Table -->
                <table class="product-table">
                  <thead>
                    <tr>
                      <th style="width: 20%;">Imagen</th>
                      <th style="width: 40%;">Producto</th>
                      <th style="width: 15%; text-align: right;">Precicio</th>
                      <th style="width: 25%; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {{#each products}}
                    <tr>
                      <td style="text-align: center;">
                        <img src="{{ image }}" alt="{{ name }}" style="max-width: 70px; height: auto;">
                      </td>
                      <td>
                        <strong>{{ name }}</strong><br>
                        Cantidad: {{ qty }}
                      </td>
                      <td style="text-align: right;">${{ price }}</td>
                      <td style="text-align: right;">${{ total }}</td>
                    </tr>
                    {{/each}}

                    <!-- Shipping Row -->
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right;">Envío:</td>
                      <td style="text-align: right;">${{ shipping }}</td>
                    </tr>

                    <!-- Total Row -->
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right;">Total del Pedido:</td>
                      <td style="text-align: right;">${{ total }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Shipping Address -->
                <p style="margin: 20px 0;">
                  <strong>Dirección de envío:</strong><br>
                  {{ shippingAddress.address1 }},<br>
                  {{ shippingAddress.city }}, {{ shippingAddress.state }}, {{ shippingAddress.country }}
                </p>

                <!-- Tracking -->
                {{#if trackingUrl}}
                <p style="margin: 15px 0;">
                  <strong>Rastrea tu pedido:</strong><br>
                  <a href="{{ trackingUrl }}">Ver estado de envío</a>
                </p>
                {{/if}}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://www.mongir.com/mis-pedidos" class="cta-button">Ir a Mis Pedidos</a>
              </div>

              <!-- Social Media -->
              <div style="text-align: center; padding: 20px;">
                <p>Síguenos en:</p>
                <a href="https://www.facebook.com/almacenmongir">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/38419b19-8e77-421c-865d-ec9433981870/304x304.png" 
                       alt="Facebook" width="40" style="margin: 0 10px;">
                </a>
                <a href="https://www.instagram.com/almacenmongir/">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/392d9bd9-3d81-4d6d-af25-550f9e4f3f4e/304x304.png" 
                       alt="Instagram" width="40" style="margin: 0 10px;">
                </a>
                <a href="https://www.tiktok.com/@almacenmongir">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/f815cc6b-39c5-4c73-9c17-877a78f01068/304x304.png" 
                       alt="TikTok" width="40" style="margin: 0 10px;">
                </a>
              </div>

              <!-- Footer -->
              <div style="padding: 20px; text-align: center; font-size: 14px; color: #666;">
                <p>NOTA: Este es un email automático, no lo respondas.<br>
                   Contáctanos si tienes alguna pregunta.</p>
                <p style="margin: 15px 0;">
                  <a href="https://www.mongir.com/terms">Términos y condiciones</a> | 
                  <a href="https://www.mongir.com/privacy">Política de privacidad</a> | 
                  <a href="https://www.mongir.com/contacto">Contáctanos</a>
                </p>
                <p>Mongir - Medellín, Colombia</p>
                <p style="margin-top: 15px;">
                  <a href="{{{unsubscribe}}}">Darse de baja</a>
                </p>
              </div>

            </div>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
`;
};
