import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing request body",
        }),
      };
    }

    const wishlistData: WishlistData = JSON.parse(event.body);

    // Validate required fields
    if (!wishlistData.id || typeof wishlistData.id !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing or invalid wishlist ID in request body",
        }),
      };
    }

    if (!wishlistData.name || typeof wishlistData.name !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing or invalid wishlist name in request body",
        }),
      };
    }

    if (!Array.isArray(wishlistData.items)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing or invalid items array in request body",
        }),
      };
    }

    // Validate wishlist ID format (should match the format from CreateWishlist)
    if (!/^[a-z]+-[a-z]+$/.test(wishlistData.id)) {
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

    const fileName = `${wishlistData.id}.json`;

    // Check if wishlist exists in S3
    try {
      await s3Client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
        })
      );
    } catch (error: any) {
      // If error is NoSuchKey/NotFound with 404, the wishlist doesn't exist
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
            wishlistId: wishlistData.id,
          }),
        };
      }

      // Re-throw other unexpected errors
      throw error;
    }

    // Update the wishlist in S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: JSON.stringify(wishlistData, null, 2),
        ContentType: "application/json",
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "PUT, OPTIONS",
      },
      body: JSON.stringify({
        message: "Wishlist updated successfully",
      }),
    };
  } catch (error) {
    console.error("Error updating wishlist:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error updating wishlist",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
