import { gql, GraphQLClient } from "graphql-request";

const storefrontAccessToken = "742089716f80fa924cd6608618137dd7";

const endpoint = "https://amaua.myshopify.com/api/2025-01/graphql.json";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
});

export async function updateShopifyProducts() {
  const getAllProductsQuery = gql`
    query GetAllProducts {
      products(first: 40) {
        edges {
          node {
            id
            handle
            availableForSale
            totalInventory

            variants(first: 40) {
              edges {
                node {
                  id
                  sku
                  availableForSale
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    altText
                    url
                  }
                }
              }
            }

            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await graphQLClient.request(getAllProductsQuery);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
