import type { WishlistData } from "@wishlist/common";
import { WishlistNotFoundError, WishlistStore } from "./WishlistStore";

export class S3WishlistStore extends WishlistStore {
  private baseUrl: string;

  constructor() {
    super();
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!this.baseUrl) {
      throw new Error("VITE_API_BASE_URL environment variable is required");
    }
  }

  async createWishlist(name: string): Promise<string> {
    console.log(`S3WishlistStore: Creating wishlist with name: ${name}`);

    try {
      const response = await fetch(`${this.baseUrl}/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlistName: name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create wishlist: ${errorData.message || response.statusText}`,
        );
      }

      const data = await response.json();
      const newWishlistId = data.wishlist.id;

      console.log(
        `S3WishlistStore: Created wishlist with id: ${newWishlistId}`,
      );
      return newWishlistId;
    } catch (error) {
      console.error("Error creating wishlist:", error);
      throw error;
    }
  }

  async getWishlist(id: string): Promise<WishlistData> {
    if (!id) {
      throw new Error("Invalid wishlist ID");
    }

    console.log(`S3WishlistStore: Getting wishlist with id: ${id}`);

    try {
      const response = await fetch(`${this.baseUrl}/wishlists/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        throw new WishlistNotFoundError(`Wishlist with ID ${id} not found`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to get wishlist: ${errorData.message || response.statusText}`,
        );
      }

      const data = await response.json();
      return data.wishlist;
    } catch (error) {
      console.error("Error getting wishlist:", error);
      throw error;
    }
  }

  async saveWishlist(id: string, wishlistData: WishlistData): Promise<void> {
    console.log(`S3WishlistStore: Saving wishlist with id: ${id}`);
    console.log("Wishlist data:", wishlistData);

    try {
      const response = await fetch(`${this.baseUrl}/wishlists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishlistData),
      });

      if (response.status === 404) {
        throw new WishlistNotFoundError(`Wishlist with ID ${id} not found`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save wishlist: ${errorData.message || response.statusText}`,
        );
      }

      console.log("Wishlist saved successfully to S3.");
    } catch (error) {
      console.error("Error saving wishlist:", error);
      throw error;
    }
  }
}
