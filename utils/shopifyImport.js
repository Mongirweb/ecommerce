import { gql, GraphQLClient } from "graphql-request";

const storefrontAccessToken = "2f2d0e1fb90bc112b2ced74d34f0cc7a";

const endpoint =
  "https://noir-perfumeria.myshopify.com/api/2025-01/graphql.json";

// const storefrontAccessToken = "90ddbfea234687e7038e0ee01d702ddb";

// const endpoint =
//   "https://aleko-comercializadora.myshopify.com/api/2025-01/graphql.json";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
});

export async function getAllProducts() {
  const getAllProductsPaginatedQuery = gql`
    query GetAllProducts($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            productType
            collections(first: 5) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
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
    let hasNextPage = true;
    let endCursor = null;
    let allProducts = [];
    while (hasNextPage) {
      const variables = {
        cursor: endCursor, // null for first page, then set to endCursor for subsequent pages
      };

      const response = await graphQLClient.request(
        getAllProductsPaginatedQuery,
        variables
      );

      // Extract relevant pagination info
      const { edges, pageInfo } = response.products;
      const { hasNextPage: nextPage, endCursor: cursor } = pageInfo;

      // Push products into our array
      const productsPage = edges.map((edge) => edge.node);
      allProducts = allProducts.concat(productsPage);

      // Update loop variables
      hasNextPage = nextPage;
      endCursor = cursor;
    }

    return allProducts;
  } catch (error) {
    throw new Error(error);
  }
}
