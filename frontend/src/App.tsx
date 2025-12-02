import type { WishlistItemData } from "@wishlist/common";
import { useEffect, useMemo, useState } from "react";
import EditItemModal from "./components/EditItemModal";
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
  const [wishlistMode, setWishlistMode] = useState<WishlistMode | null>("gifter");
  const [wishlistContent, setWishlistContent] = useState<WishlistData | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: WishlistItemData; index: number } | null>(null);

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
    // Optimistic update - update UI immediately
    setWishlistContent(updatedWishlist);

    try {
      await wishlistStore.saveWishlist(wishlistId, updatedWishlist);
    } catch (error) {
      console.error("Failed to save wishlist:", error);
      // TODO: Revert optimistic update on error
      // For now, we'll leave the optimistic update in place
    }
  };

  const handleEditItem = (item: WishlistItemData, index: number) => {
    setEditingItem({ item, index });
    setEditModalOpen(true);
  };

  const handleModalSave = async (updatedItem: WishlistItemData) => {
    if (!wishlistContent) return;

    let updatedItems: WishlistItemData[];

    if (editingItem) {
      // Editing existing item
      updatedItems = [...wishlistContent.items];
      updatedItems[editingItem.index] = updatedItem;
    } else {
      // Adding new item
      updatedItems = [...wishlistContent.items, updatedItem];
    }

    const updatedWishlist: WishlistData = {
      name: wishlistContent.name,
      items: updatedItems,
    };

    await handleSaveWishlist(updatedWishlist);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setEditingItem(null); // No existing item when adding
    setEditModalOpen(true);
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
          onEditItem={handleEditItem}
          onAddItem={handleAddItem}
        />
      )}

      <EditItemModal
        isOpen={editModalOpen}
        item={editingItem?.item}
        isEditingNewItem={editingItem === null}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
}

export default App;
