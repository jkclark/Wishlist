import type { WishlistItemData } from "@wishlist/common";
import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Wishlist from "./components/Wishlist";
import { DummyWishlistStore } from "./wishlist_storage/DummyWishlistStore";
import type { WishlistStore } from "./wishlist_storage/WishlistStore";

export type WishlistMode = "owner" | "gifter";
export interface WishlistData {
  name: string;
  items: WishlistItemData[];
}

function App() {
  const wishlistStore: WishlistStore = useMemo(() => new DummyWishlistStore(), []);

  const [wishlistId, setWishlistId] = useState<string>("dummy-id");
  const [wishlistMode, setWishlistMode] = useState<WishlistMode | null>("owner");
  const [wishlistContent, setWishlistContent] = useState<WishlistData | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlistMode) {
        const data = await wishlistStore.getWishlist(wishlistId);
        setWishlistContent(data);
      }
    };

    fetchWishlist();
  }, [wishlistId, wishlistMode, wishlistStore]);

  const handleSaveWishlist = async (updatedWishlist: WishlistData) => {
    try {
      await wishlistStore.saveWishlist(wishlistId, updatedWishlist);
      setWishlistContent(updatedWishlist);
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  };

  return (
    <div className="w-full h-dvh flex bg-base-100 flex-0 flex-col">
      <Navbar />
      {wishlistMode && wishlistContent && (
        <Wishlist
          name={wishlistContent.name}
          mode={wishlistMode}
          items={wishlistContent.items}
          onSaveWishlist={handleSaveWishlist}
        />
      )}
    </div>
  );
}

export default App;
