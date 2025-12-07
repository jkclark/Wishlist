import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { WishlistData } from "@wishlist/common";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

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

    const requestBody = JSON.parse(event.body);
    const { wishlistName } = requestBody;

    if (!wishlistName || typeof wishlistName !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing or invalid wishlistName in request body",
        }),
      };
    }

    // Generate unique random ID with retry logic
    let randomId = "";
    let fileName = "";
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      randomId = generateRandomId();
      fileName = `${randomId}.json`;
      attempts++;

      // Check if object already exists
      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
          })
        );

        // If we get here, the object exists - continue loop to try again
        console.log(`Object ${fileName} exists, trying again (attempt ${attempts}/${maxAttempts})`);
      } catch (error: any) {
        // If error is NotFound or NoSuchKey with 404, that's what we want - object doesn't exist
        if (
          error.name === "NotFound" ||
          error.name === "NoSuchKey" ||
          error.$metadata?.httpStatusCode === 404
        ) {
          break; // Exit the loop, we found a unique ID
        } else {
          throw error; // Re-throw other unexpected errors
        }
      }
    }

    // If we exit the loop without finding a unique ID, return error
    if (attempts >= maxAttempts) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Failed to generate unique ID after maximum attempts",
          attempts: maxAttempts,
        }),
      };
    }

    // Create WishlistData object
    const wishlistData: WishlistData = {
      id: randomId,
      name: wishlistName,
      items: [],
    };

    // Save to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: JSON.stringify(wishlistData, null, 2),
        ContentType: "application/json",
      })
    );

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        message: "Wishlist created successfully",
        wishlist: wishlistData,
      }),
    };
  } catch (error) {
    console.error("Error creating wishlist:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error creating wishlist",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

function generateRandomId(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
    style: "lowerCase",
  });
}
