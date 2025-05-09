// app/api/coordinadora/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1) Construct the SOAP envelope & body.
    //    - Make sure all namespaces (soapenv, xsd, xsi, soapenc, ser) match
    //      Coordinadora’s docs.
    //    - Fill in your credentials/fields inside <p xsi:type="ser:Agw_typeGenerarGuiaIn">.
    const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="https://sandbox.coordinadora.com/agw/ws/guias/1.6/server.php" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
    xmlns:ns1="https://sandbox.coordinadora.com/agw/ws/guias/1.6/server.php"
>
  <soapenv:Header/>
  <soapenv:Body>
    <ser:Guias_generarGuia soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <p xsi:type="ser:Agw_typeGenerarGuiaIn">
      
        <!-- Credentials -->
        <usuario xsi:type="xsd:string">somoselhueco.ws</usuario>
        <clave xsi:type="xsd:string">b4af0f42c83666ecfeec0fe68e432721598d8a6f226398ce9fbfcd927296ea14</clave>

        <!-- Basic Info -->
        <codigo_remision xsi:type="xsd:string"></codigo_remision>
        <fecha xsi:type="xsd:string"></fecha>
        <id_cliente xsi:type="xsd:int">51967</id_cliente>
        <id_remitente xsi:type="xsd:int"></id_remitente>
        <nombre_remitente xsi:type="xsd:string">Somoselhueco S.A.S</nombre_remitente>
        <direccion_remitente xsi:type="xsd:string">calle 46 # 52-26</direccion_remitente>
        <telefono_remitente xsi:type="xsd:string">3136260281</telefono_remitente>
        <ciudad_remitente xsi:type="xsd:string">05001000</ciudad_remitente>

        <!-- Destination -->
        <nit_destinatario xsi:type="xsd:string">12345678</nit_destinatario>
        <div_destinatario xsi:type="xsd:string"></div_destinatario>
        <nombre_destinatario xsi:type="xsd:string">Jon Doe</nombre_destinatario>
        <direccion_destinatario xsi:type="xsd:string">cra 89 no 35 - 51</direccion_destinatario>
        <ciudad_destinatario xsi:type="xsd:string">05001000</ciudad_destinatario>
        <telefono_destinatario xsi:type="xsd:string">3136260281</telefono_destinatario>

        <!-- Shipment Details -->
        <valor_declarado xsi:type="xsd:float">53500</valor_declarado>
        <codigo_cuenta xsi:type="xsd:int">3</codigo_cuenta>
        <codigo_producto xsi:type="xsd:int">0</codigo_producto>
        <nivel_servicio xsi:type="xsd:int">1</nivel_servicio>
        <linea xsi:type="xsd:string"></linea>
        <contenido xsi:type="xsd:string">Productos varios</contenido>
        <referencia xsi:type="xsd:string">Factura #1234</referencia>
        <observaciones xsi:type="xsd:string">Ninguna</observaciones>
        <estado xsi:type="xsd:string">IMPRESO</estado>

        <!-- Package Detail Array -->
        <detalle xsi:type="ns1:ArrayOfAgw_typeGuiaDetalle" soapenc:arrayType="ns1:Agw_typeGuiaDetalle[1]">
          <item xsi:type="ns1:Agw_typeGuiaDetalle">
            <ubl xsi:type="xsd:int">0</ubl>
            <alto xsi:type="xsd:float">20</alto>
            <ancho xsi:type="xsd:float">20</ancho>
            <largo xsi:type="xsd:float">12</largo>
            <peso xsi:type="xsd:float">2</peso>
            <unidades xsi:type="xsd:int">1</unidades>
            <referencia xsi:type="xsd:string"></referencia>
            <nombre_empaque xsi:type="xsd:string"></nombre_empaque>
          </item>
        </detalle>

        <!-- Optional / Additional Fields -->
        <cuenta_contable xsi:type="xsd:string"></cuenta_contable>
        <centro_costos xsi:type="xsd:string"></centro_costos>

        <!-- Recaudos array can be empty or repeated -->
        <recaudos xsi:type="ser:ArrayOfAgw_typeGuiaDetalleRecaudo" soapenc:arrayType="ser:Agw_typeGuiaDetalleRecaudo[]">
          <item>
            <referencia></referencia>
            <valor></valor>
            <valor_base_iva></valor_base_iva>
            <valor_iva></valor_iva>
            <forma_pago></forma_pago>
          </item>
        </recaudos>

        <margen_izquierdo xsi:type="xsd:float">0</margen_izquierdo>
        <margen_superior xsi:type="xsd:float">0</margen_superior>
        <id_rotulo xsi:type="xsd:int"></id_rotulo>
        <usuario_vmi xsi:type="xsd:string"></usuario_vmi>
        <formato_impresion xsi:type="xsd:string">PDF</formato_impresion>
        <atributo1_nombre xsi:type="xsd:string"></atributo1_nombre>
        <atributo1_valor xsi:type="xsd:string"></atributo1_valor>
        <notificaciones xsi:type="ns1:ArrayOfAgw_typeNotificaciones"/>
        <atributos_retorno xsi:type="ns1:Agw_typeAtributosRetorno"/>
        <nro_doc_radicados xsi:type="xsd:string"></nro_doc_radicados>
        <nro_sobre xsi:type="xsd:string"></nro_sobre>

      </p>
    </ser:Guias_generarGuia>
  </soapenv:Body>
</soapenv:Envelope>`;

    // 2) Send the SOAP request to Coordinadora’s sandbox endpoint.
    //    Note: "Content-Type" can often be "text/xml" for SOAP; some services accept "application/xml".
    const response = await fetch(
      "https://sandbox.coordinadora.com/agw/ws/guias/1.6/server.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
        },
        body: soapBody,
      }
    );

    // 3) Parse the SOAP XML response as text.
    const responseText = await response.text();

    // 4) Return the raw SOAP response. If you want to parse or transform it further,
    //    you'd typically use an XML parser library. For now, let's just return the XML.
    return new NextResponse(responseText, {
      status: response.ok ? 200 : 500,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error creating guía:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
