/**************************************************
 * 1) Import and Setup
 **************************************************/
import { gql, GraphQLClient } from "graphql-request";

// ---- ADMIN API credentials (PRIVATE or CUSTOM app) ----
const adminAccessToken = "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";
const adminEndpoint =
  "https://amaua.myshopify.com/admin/api/2023-10/graphql.json";

export const adminGraphQLClient = new GraphQLClient(adminEndpoint, {
  headers: {
    "X-Shopify-Access-Token": adminAccessToken,
  },
});

/**************************************************
 * 2) Query: Fetch a Single Variant by Numeric ID
 **************************************************/
/**
 * Example usage:
 *    const numericId = "50269230104875"; // from "idShopify"
 *    const variant = await getVariantInventory(numericId);
 *    // variant.inventoryItem.inventoryLevels.edges => array of locations/quantities
 */
const GET_VARIANT_WITH_INVENTORY = gql`
  query getVariantInventory($id: ID!) {
    productVariant(id: $id) {
      id
      sku
      title
      inventoryItem {
        id
        inventoryLevels(first: 10) {
          edges {
            node {
              id # This is the inventoryLevelId
              available # Current available quantity
              location {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Retrieves a single variant and its inventory levels by numeric ID (e.g. "50269230104875").
 *
 * @param {string} numericId - The numeric variant ID from Shopify
 * @returns {object} productVariant data, including inventoryLevels
 */
export async function getVariantInventory(numericId) {
  try {
    // Reconstruct the GID
    const variantGID = `gid://shopify/ProductVariant/50269230104875`;

    const response = await adminGraphQLClient.request(
      GET_VARIANT_WITH_INVENTORY,
      {
        id: variantGID,
      }
    );
    console.log(response.productVariant);
    return response.productVariant; // might be null if not found
  } catch (error) {
    console.error("Error fetching variant inventory:", error);
    throw error;
  }
}

/**************************************************
 * 3) Mutation: Adjust Inventory
 **************************************************/
const ADJUST_INVENTORY_MUTATION = gql`
  mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
    inventoryAdjustQuantity(input: $input) {
      inventoryLevel {
        id
        available
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Adjusts inventory at a specific inventoryLevelId by quantityDelta.
 * If quantityDelta is negative, it reduces inventory; if positive, it increases it.
 *
 * @param {string} inventoryLevelId - e.g. "gid://shopify/InventoryLevel/123456789"
 * @param {number} quantityDelta - e.g. -5 to subtract 5 units
 * @returns {object} updated inventoryLevel info
 */
export async function adjustInventory(inventoryLevelId, quantityDelta) {
  try {
    const variables = {
      input: {
        inventoryLevelId,
        availableDelta: quantityDelta,
      },
    };
    const response = await adminGraphQLClient.request(
      ADJUST_INVENTORY_MUTATION,
      variables
    );
    const userErrors = response.inventoryAdjustQuantity.userErrors;
    if (userErrors && userErrors.length) {
      throw new Error(JSON.stringify(userErrors));
    }
    return response.inventoryAdjustQuantity.inventoryLevel;
  } catch (error) {
    console.error("Error adjusting inventory:", error);
    throw error;
  }
}
