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
      },
      {
        name: "Smart Watch",
        link: "https://example.com/smartwatch",
        price: 199.99,
        bought: false,
        received: false,
      },
      {
        name: "E-Reader",
        link: "https://example.com/ereader",
        price: 129.99,
        bought: true,
        received: true,
      },
      {
        name: "Any NFL Giants gear",
        link: "https://example.com/headphones",
        price: 0,
        bought: false,
        received: false,
      },
      {
        name: "Smart Watch",
        link: "",
        price: 199.99,
        bought: false,
        received: false,
      },
      {
        name: "E-Reader",
        link: "https://example.com/ereader",
        price: 129.99,
        bought: true,
        received: true,
      },
    ],
  };

  async createWishlist(name: string): Promise<WishlistData> {
    console.log(`DummyWishlistStore: Creating wishlist with name: ${name}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dummyWishlist: WishlistData = {
      id: "new-dummy-wishlist-id",
      name,
      items: [],
    };
    console.log(`DummyWishlistStore: Created wishlist with id: ${dummyWishlist.id}`);
    return dummyWishlist;
  }

  async getWishlist(id: string): Promise<WishlistData> {
    if (!id) {
      throw new Error("Invalid wishlist ID");
    }

    console.log(`DummyWishlistStore: Getting wishlist with id: ${id}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

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
