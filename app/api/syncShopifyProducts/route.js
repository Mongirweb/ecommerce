// /app/api/shopify/getVariantMetafield/route.js
import { NextResponse } from "next/server";
import { GraphQLClient, gql } from "graphql-request";

// 1) Configure your Admin API details
const adminApiVersion = "2025-01";
const shopName = "amaua"; // your shop subdomain
const adminAccessToken = "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"; // store securely

const adminEndpoint = `https://${shopName}.myshopify.com/admin/api/${adminApiVersion}/graphql.json`;

// 2) Initialize the GraphQL client with the Admin token
const adminClient = new GraphQLClient(adminEndpoint, {
  headers: {
    "X-Shopify-Access-Token": adminAccessToken,
  },
});

// 3) Define the same query from Shopify docs
const PRODUCT_VARIANT_METAFIELD = gql`
  query ProductVariantMetafield(
    $namespace: String
    $key: String
    $ownerId: ID!
  ) {
    productVariant(id: $ownerId) {
      id
      sku
    }
  }
`;

// 4) Export the handler (POST or GET, your choice)
export async function POST(request) {
  try {
    // - Parse the JSON body to get the variables needed
    //   e.g. { "namespace": "my_fields", "key": "liner_material", "ownerId": "gid://shopify/ProductVariant/43729076" }
    const { namespace, key, ownerId } = await request.json();

    // - Make the GraphQL request
    const data = await adminClient.request(PRODUCT_VARIANT_METAFIELD, {
      namespace,
      key,
      ownerId,
    });

    // - Return the result to the client
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching metafield:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
