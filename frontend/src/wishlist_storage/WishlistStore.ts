import type { WishlistData } from "../App";

export abstract class WishlistStore {
  abstract getWishlist(id: string): Promise<WishlistData>;
  abstract saveWishlist(id: string, wishlistData: WishlistData): Promise<void>;
}
