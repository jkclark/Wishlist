export interface WishlistItemData {
  name: string;
  link: string;
  price: number;
  notes: string;
  bought: boolean;
  received: boolean;
}

export interface WishlistData {
  id: string;
  name: string;
  items: WishlistItemData[];
}
