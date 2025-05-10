export const welcomeEmailTemplate = ({ name }) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" type="text/css">

  <style type="text/css">
    body,
    p,
    div,
    span,
    a,
    h1,
    h2,
    h3 {
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
      text-align: center !important;
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
      width: 100%;
    }

    .section {
      padding: 20px;
    }

    .menu,
    .cta {
      background-color: #142D4A;
      border-radius: 0px;
      padding: 15px 0;
      color: #ffffff;
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
    }

    .menu a,
    .cta a {
      font-size: 14px;
      color: #ffffff;
      margin: 0 10px;
      text-decoration: none;
    }

    .footer {
      font-size: 14px;
      padding: 20px;
      max-width: 600px;
      margin: auto;
    }

    @media only screen and (max-width: 600px) {
      .menu a,
      .cta a {
        display: block;
        margin: 10px auto;
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

              <!-- LOGO -->
              <div class="section">
                <a href="https://www.mongir.com/">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/12f6ec65-5670-4137-af41-f318e7165c25/323x112.png" alt="Logo Mongir" class="max-width" width="150">
                </a>
              </div>

              <!-- TEXTO DE BIENVENIDA -->
              <div class="section">
                <p>Hola ${name}. ¡Bienvenido a Mogir! Gracias por iniciar sesión.</p>
                <p>&nbsp;</p>
                <p>Encuentra los mejores productos y accesorios para bebés y niños con la calidad que tu familia merece.</p>
              </div>

              <!-- MENÚ -->
              <!--<div class="menu">-->
              <!--  <a href="https://www.mongir.com/browse?category=67d3450902d26a8677f2e260">Primer día</a>-->
              <!--  <a href="https://www.mongir.com/browse?category=67d344eb02d26a8677f2e228">Ropa</a>-->
              <!--  <a href="https://www.mongir.com/browse?category=67d344f302d26a8677f2e236">Calzado</a>-->
              <!--  <a href="https://www.mongir.com/browse?category=67d344fa02d26a8677f2e244">Accesorios</a>-->
              <!--  <a href="https://www.mongir.com">Todo</a>-->
              <!--</div>-->

              <!-- ENCABEZADO PRINCIPAL -->
              <div class="section">
                <a href="https://www.mongir.com">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/6d748d97-31a7-4490-8c35-974511049447/740x906.PNG" alt="Encabezado" class="max-width">
                </a>
              </div>

              <!-- BOTÓN DESTACADO -->
              <div class="cta">
                <a href="https://www.mongir.com/">Ingresa a www.mongir.com</a>
              </div>

               <!-- TEXTO PRINCIPAL -->
              <div class="section">
                <p><strong>¡VISÍTANOS!</strong></p>
                <p>&nbsp;</p>
                <p>Estamos a una cuadra de la estación San Antonio.</p>
                
                <p><a href="https://www.google.com/maps/place/Calle+46+%23+52,+Medell%C3%ADn,+Antioquia" target="_blank" style="text-decoration:none; color:inherit;"><img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Ubicación" width="16" style="vertical-align:middle; margin-right:6px; filter: grayscale(100%);">Calle 46 # 52, Medellín, Antioquia</a></p>
                <p>&nbsp;</p>
                <p>Síguenos en:</p>
              </div>

              <!-- REDES SOCIALES -->
              <div class="section">
                <a href="https://www.facebook.com/almacenmongir/?locale=es_LA">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/38419b19-8e77-421c-865d-ec9433981870/304x304.png" alt="Facebook" width="50">
                </a>
                <a href="https://www.instagram.com/almacenmongir/">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/392d9bd9-3d81-4d6d-af25-550f9e4f3f4e/304x304.png" alt="Instagram" width="50">
                </a>
                <a href="https://www.tiktok.com/@almacenmongir">
                  <img src="http://cdn.mcauto-images-production.sendgrid.net/52f6a5de8d102239/f815cc6b-39c5-4c73-9c17-877a78f01068/304x304.png" alt="TikTok" width="50">
                </a>
              </div>

              <!-- PIE DE PÁGINA -->
              <div class="footer">
                <p>NOTA: Este es un email generado automáticamente, no lo respondas.</p>
                <p>&nbsp;</p>
                <p>Contáctanos si tienes alguna pregunta.</p>
                <p><a href="https://www.mongir.com/terms">Términos y condiciones</a> | <a href="https://www.mongir.com/privacy">Política de Privacidad</a> | <a href="https://www.mongir.com/clientWhatsApp">Contáctanos</a></p>
                <p>&nbsp;</p>
                <p>Mongir - Medellín, Colombia</p>
              </div>

              <!-- UNSUBSCRIBE -->
              <div class="footer">
                <p><a href="{{{unsubscribe}}}">Darse de baja</a></p>
              </div>

            </div>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>

</html>`;
};
