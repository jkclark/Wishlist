import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { WishlistData } from "@wishlist/common";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const BUCKET_NAME = process.env.S3_BUCKET!;

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    // Get wishlist ID from path parameters
    const wishlistId = event.pathParameters?.id;

    if (!wishlistId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing wishlist ID in path parameters",
        }),
      };
    }

    // Validate wishlist ID format (should match the format from CreateWishlist)
    if (!/^[a-z]+-[a-z]+$/.test(wishlistId)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Invalid wishlist ID format",
        }),
      };
    }

    const fileName = `${wishlistId}.json`;

    // Get object from S3
    try {
      const getObjectResult = await s3Client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
        })
      );

      // Convert the stream to string
      const wishlistJson = await getObjectResult.Body?.transformToString();

      if (!wishlistJson) {
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            message: "Failed to read wishlist data from S3",
          }),
        };
      }

      // Parse the JSON
      const wishlistData: WishlistData = JSON.parse(wishlistJson);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
        body: JSON.stringify({
          message: "Wishlist retrieved successfully",
          wishlist: wishlistData,
        }),
      };
    } catch (error: any) {
      // Handle case where wishlist doesn't exist
      if (
        error.name === "NoSuchKey" ||
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return {
          statusCode: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            message: "Wishlist not found",
            wishlistId: wishlistId,
          }),
        };
      }

      // Re-throw other unexpected errors
      throw error;
    }
  } catch (error) {
    console.error("Error retrieving wishlist:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error retrieving wishlist",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
