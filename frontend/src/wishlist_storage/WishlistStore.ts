import type { WishlistData } from "@wishlist/common";

export abstract class WishlistStore {
  abstract createWishlist(name: string): Promise<WishlistData>;
  abstract getWishlist(id: string): Promise<WishlistData>;
  abstract saveWishlist(id: string, wishlistData: WishlistData): Promise<void>;
}
