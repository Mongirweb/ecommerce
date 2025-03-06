import Client from "shopify-buy";

const storefrontAccessToken = "742089716f80fa924cd6608618137dd7";

const endpoint = "amaua.myshopify.com";

const client = Client.buildClient({
  domain: endpoint,
  storefrontAccessToken: storefrontAccessToken,
});

export async function getProductsShop() {
  try {
    const products = await client.product.fetchAll();

    return products;
  } catch (error) {
    console.log(error);
  }
}
