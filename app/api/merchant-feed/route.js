import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import escape from "escape-html"; // npm i escape-html if you don't have it

export async function GET() {
  await db.connectDb();

  const products = await Product.find({}).lean();

  function toXml(p) {
    const items = [];

    p.subProducts.forEach((sp, idx) => {
      const id = sp.sku || `${p.sku}-${idx}`;
      const url = `https://somoselhueco.com/product/${p.slug}?style=0&amp;size=0`;
      const imgMain = sp.images?.[0]?.url || p.mainImage || "";
      const imgExtra = sp.images?.slice(1) || [];

      items.push(`
        <item>
          <g:id>${escape(id)}</g:id>
          <g:title><![CDATA[${p.name}]]></g:title>
          <g:description><![CDATA[${p.description || p.name}]]></g:description>
          <g:link>${escape(url)}</g:link>
          <g:image_link>${escape(imgMain)}</g:image_link>
          ${imgExtra
            .map(
              (im) =>
                `<g:additional_image_link>${escape(
                  im.url
                )}</g:additional_image_link>`
            )
            .join("")}
          <g:price>${sp.price} COP</g:price>
          <g:availability>${
            sp.sizes.some((s) => s.qty > 0) ? "in stock" : "out of stock"
          }</g:availability>
          <g:brand><![CDATA[Tu Marca]]></g:brand>
          
        </item>`);
    });

    return items.join("");
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
      <title>Feed Tienda</title>
      <link>https://tu-dominio.com</link>
      <description>Catálogo exportado a Google Merchant Center</description>
      ${products.map(toXml).join("")}
    </channel>
  </rss>`;

  await db.disconnectDb();
  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
