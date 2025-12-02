import type { WishlistData } from "../App";
import { WishlistStore } from "./WishlistStore";

export class DummyWishlistStore extends WishlistStore {
  private dummyWishlist: WishlistData = {
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
        name: "Wireless Headphones HyperX Cloud III S Wireless Headphones",
        link: "https://example.com/headphones",
        price: 99.99,
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

  async getWishlist(id: string): Promise<WishlistData> {
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
