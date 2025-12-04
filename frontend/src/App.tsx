import type { WishlistData, WishlistItemData } from "@wishlist/common";
import { useEffect, useMemo, useState } from "react";
import DeleteItemModal from "./components/DeleteItemModal";
import EditItemModal from "./components/EditItemModal";
import Navbar from "./components/Navbar";
import WelcomeMenu from "./components/WelcomeMenu";
import Wishlist from "./components/Wishlist";
import WishlistModeMenu from "./components/WishlistModeMenu";
import { DummyWishlistStore } from "./wishlist_storage/DummyWishlistStore";
import type { WishlistStore } from "./wishlist_storage/WishlistStore";

export type WishlistMode = "owner" | "gifter";

function App() {
  const wishlistStore: WishlistStore = useMemo(() => new DummyWishlistStore(), []);

  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [wishlistMode, setWishlistMode] = useState<WishlistMode | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: WishlistItemData; index: number } | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ name: string; index: number } | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlistId && wishlistMode) {
        const data = await wishlistStore.getWishlist(wishlistId);
        setWishlistData(data);
      }
    };

    fetchWishlist();
  }, [wishlistId, wishlistMode, wishlistStore]);

  const resetWishlistState = () => {
    setWishlistId(null);
    setWishlistData(null);
    setWishlistMode(null);
  };

  const handleSaveWishlist = async (updatedWishlist: WishlistData) => {
    // Optimistic update - update UI immediately
    setWishlistData(updatedWishlist);

    if (!wishlistId) {
      console.error("No wishlist ID set. Cannot save wishlist.");
      return;
    }

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

  const handleEditModalSave = async (updatedItem: WishlistItemData) => {
    if (!wishlistId || !wishlistData) {
      console.error("Either wishlist ID or data is not set. Cannot save item.");
      return;
    }

    let updatedItems: WishlistItemData[];

    if (editingItem) {
      // Editing existing item
      updatedItems = [...wishlistData.items];
      updatedItems[editingItem.index] = updatedItem;
    } else {
      // Adding new item
      updatedItems = [...wishlistData.items, updatedItem];
    }

    const updatedWishlist: WishlistData = {
      id: wishlistId,
      name: wishlistData.name,
      items: updatedItems,
    };

    await handleSaveWishlist(updatedWishlist);
  };

  const handleEditItemModalClose = () => {
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setEditingItem(null); // No existing item when adding
    setEditModalOpen(true);
  };

  const handleDeleteItem = (item: WishlistItemData, index: number) => {
    setDeletingItem({ name: item.name, index });
    setDeleteModalOpen(true);
  };

  const handleDeleteItemConfirm = async () => {
    if (!wishlistId || !wishlistData || !deletingItem) {
      console.error("Either wishlist ID, data, or deleting item is not set. Cannot delete item.");
      return;
    }

    const updatedItems = [...wishlistData.items];
    updatedItems.splice(deletingItem.index, 1);

    const updatedWishlist: WishlistData = {
      id: wishlistId,
      name: wishlistData.name,
      items: updatedItems,
    };

    await handleSaveWishlist(updatedWishlist);
    setDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleCreateWishlist = async (name: string) => {
    try {
      // Create wishlist using the store and get the new ID
      const newWishlist = await wishlistStore.createWishlist(name);

      // Update state with new wishlist
      setWishlistId(newWishlist.id);
      setWishlistData(newWishlist);
      setWishlistMode("owner"); // Assume creator is the owner
    } catch (error) {
      console.error("Failed to create wishlist:", error);
      // TODO: Show error message to user
    }
  };

  const handleLoadWishlist = async (id: string) => {
    try {
      const data = await wishlistStore.getWishlist(id);
      setWishlistId(id);
      setWishlistData(data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="w-full h-dvh flex bg-base-100 flex-0 flex-col">
      <Navbar
        wishlistName={wishlistData?.name}
        onNewLoad={resetWishlistState}
        showNavbarContents={!!(wishlistId && wishlistData && wishlistMode)}
      />

      {/* Welcome menu shown when no wishlist is loaded */}
      {(!wishlistId || !wishlistData) && !wishlistMode && (
        <WelcomeMenu onCreateWishlist={handleCreateWishlist} onLoadWishlist={handleLoadWishlist} />
      )}

      {/* Wishlist mode menu after wishlist is loaded */}
      {wishlistId && wishlistData && !wishlistMode && (
        <WishlistModeMenu wishlistName={wishlistData.name} onSelectMode={(mode) => setWishlistMode(mode)} />
      )}

      {/* Wishlist view */}
      {wishlistId && wishlistData && wishlistMode && (
        <Wishlist
          mode={wishlistMode}
          wishlistData={wishlistData}
          onSaveWishlist={handleSaveWishlist}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
        />
      )}

      {/* Modals */}
      <EditItemModal
        isOpen={editModalOpen}
        item={editingItem?.item}
        isEditingNewItem={editingItem === null}
        onClose={handleEditItemModalClose}
        onSave={handleEditModalSave}
      />

      <DeleteItemModal
        isOpen={deleteModalOpen}
        itemName={deletingItem?.name || ""}
        onConfirm={handleDeleteItemConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default App;
