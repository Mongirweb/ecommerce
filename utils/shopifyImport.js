import { gql, GraphQLClient } from "graphql-request";

const storefrontAccessToken = "742089716f80fa924cd6608618137dd7";

const endpoint = "https://amaua.myshopify.com/api/2025-01/graphql.json";

// const storefrontAccessToken = "90ddbfea234687e7038e0ee01d702ddb";

// const endpoint =
//   "https://aleko-comercializadora.myshopify.com/api/2025-01/graphql.json";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
});

export async function getProducts() {
  const getAllProductsQuery = gql`
    query GetAllProducts {
      products(first: 40) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            productType
            vendor
            tags
            onlineStoreUrl
            createdAt
            updatedAt
            publishedAt
            availableForSale
            totalInventory

            options {
              id
              name
              values
            }

            images(first: 40) {
              edges {
                node {
                  altText
                  url
                  width
                  height
                }
              }
            }

            media(first: 40) {
              edges {
                node {
                  __typename
                  alt
                  mediaContentType
                  previewImage {
                    url
                  }
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                    }
                  }
                  ... on Video {
                    id
                    sources {
                      url
                      format
                    }
                  }
                  ... on ExternalVideo {
                    id
                    embeddedUrl
                  }
                  ... on Model3d {
                    id
                    sources {
                      url
                      mimeType
                    }
                  }
                }
              }
            }

            variants(first: 40) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  quantityAvailable
                  requiresShipping
                  selectedOptions {
                    name
                    value
                  }
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
    throw new Error(error);
  }
}
