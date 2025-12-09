import type { WishlistData } from "@wishlist/common";
import { WishlistStore } from "./WishlistStore";

export class DummyWishlistStore extends WishlistStore {
  private dummyWishlist: WishlistData = {
    id: "dummy-id",
    name: "Josh's wishlist",
    items: [
      {
        name: "Wireless Headphones HyperX Cloud III S Wireless Headphones",
        link: "https://example.com/headphones",
        price: 99.99,
        bought: true,
        received: false,
        notes: "These should be comfortable for long gaming sessions",
      },
      {
        name: "Smart Watch (received but not marked as bought)",
        link: "https://example.com/smartwatch",
        price: 199.99,
        bought: false,
        received: true,
        notes: "",
      },
      {
        name: "E-Reader",
        link: "https://example.com/ereader",
        price: 129.99,
        bought: true,
        received: true,
        notes: "Kindle Paperwhite preferred",
      },
      {
        name: "Any NFL Giants gear",
        link: "https://example.com/headphones",
        price: 0,
        bought: false,
        received: false,
        notes: "Jersey, cap, or anything really. Go Big Blue!",
      },
      {
        name: "Smart Watch",
        link: "",
        price: 199.99,
        bought: false,
        received: false,
        notes: "",
      },
      {
        name: "E-Reader",
        link: "https://example.com/ereader",
        price: 129.99,
        bought: true,
        received: true,
        notes: "",
      },
    ],
  };

  async createWishlist(name: string): Promise<string> {
    console.log(`DummyWishlistStore: Creating wishlist with name: ${name}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newWishlistId = "new-dummy-wishlist-id";
    console.log(
      `DummyWishlistStore: Created wishlist with id: ${newWishlistId}`,
    );

    return newWishlistId;
  }

  async getWishlist(id: string): Promise<WishlistData> {
    if (!id) {
      throw new Error("Invalid wishlist ID");
    }

    console.log(`DummyWishlistStore: Getting wishlist with id: ${id}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (id === "new-dummy-wishlist-id") {
      return {
        id: "new-dummy-wishlist-id",
        name: "New Blank Wishlist",
        items: [],
      };
    }

    return { ...this.dummyWishlist };
  }

  async saveWishlist(id: string, wishlistData: WishlistData): Promise<void> {
    console.log(`DummyWishlistStore: Saving wishlist with id: ${id}`);
    console.log("Wishlist data:", wishlistData);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Wishlist saved successfully (dummy).");
  }
}
