import type { WishlistData, WishlistItemData } from "@wishlist/common";
import { useEffect, useMemo, useState } from "react";
import DeleteItemModal from "./components/DeleteItemModal";
import EditItemModal from "./components/EditItemModal";
import Navbar from "./components/Navbar";
import WelcomeMenu from "./components/WelcomeMenu";
import Wishlist from "./components/Wishlist";
import WishlistModeMenu from "./components/WishlistModeMenu";
import { S3WishlistStore } from "./wishlist_storage/S3WishlistStore";
import type { WishlistStore } from "./wishlist_storage/WishlistStore";

export type WishlistMode = "owner" | "gifter";

// TODO:
// - deal with layout changing when edit/trash buttons are hidden/shown
// - add reasonable limits to length of fields (name, link, notes)

function App() {
  const wishlistStore: WishlistStore = useMemo(() => new S3WishlistStore(), []);

  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [wishlistMode, setWishlistMode] = useState<WishlistMode | null>(null);
  const [hasAttemptedAutoLoad, setHasAttemptedAutoLoad] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    item: WishlistItemData;
    index: number;
  } | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{
    name: string;
    index: number;
  } | null>(null);

  // NOTE: I felt that React Router would have been overkill for this simple single-page app,
  // so I implemented basic URL handling manually.
  // Check URL for wishlist ID on mount and handle browser navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const wishlistIdFromUrl = urlParams.get("id");

      if (wishlistIdFromUrl && wishlistIdFromUrl !== wishlistId) {
        // Load new wishlist from URL
        handleLoadWishlist(wishlistIdFromUrl, true);
      } else if (!wishlistIdFromUrl && wishlistId) {
        // URL shows home but we have a loaded wishlist - reset state
        setWishlistId(null);
        setWishlistData(null);
        setWishlistMode(null);
      }
    };

    // Handle initial load
    const urlParams = new URLSearchParams(window.location.search);
    const wishlistIdFromUrl = urlParams.get("id");
    if (wishlistIdFromUrl && !wishlistId && !hasAttemptedAutoLoad) {
      setHasAttemptedAutoLoad(true);
      handleLoadWishlist(wishlistIdFromUrl, true);
    }

    // Listen for browser navigation (back/forward buttons)
    window.addEventListener("popstate", handleUrlChange);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [wishlistId]); // Depend on wishlistId to handle URL/state sync

  // Use effect for loading wishlist data when wishlistId or mode changes
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
    setHasAttemptedAutoLoad(false);

    // Clear query parameters when returning to home
    window.history.pushState({}, "", "/");
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
      console.error(
        "Either wishlist ID, data, or deleting item is not set. Cannot delete item.",
      );
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
      const newWishlistId = await wishlistStore.createWishlist(name);

      // Update state with new wishlist
      setWishlistId(newWishlistId);
      setWishlistMode("owner"); // Assume creator is the owner

      // Update URL for created wishlist
      window.history.pushState({}, "", `?id=${newWishlistId}`);
    } catch (error) {
      console.error("Failed to create wishlist:", error);
      throw error;
    }
  };

  const handleLoadWishlist = async (id: string, replaceHistory = false) => {
    try {
      const data = await wishlistStore.getWishlist(id);
      setWishlistId(id);
      setWishlistData(data);

      // Always update URL when loading a wishlist
      const expectedUrl = `?id=${id}`;

      if (replaceHistory) {
        // Replace current history entry (for URL-based loads)
        window.history.replaceState({}, "", expectedUrl);
      } else {
        // Add new history entry (for manual loads)
        window.history.pushState({}, "", expectedUrl);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      throw error;
    }
  };

  return (
    <div className="bg-base-100 flex h-dvh w-full flex-0 flex-col">
      <Navbar
        wishlistId={wishlistData?.id}
        wishlistName={wishlistData?.name}
        onNewLoad={resetWishlistState}
        showNavbarContents={!!(wishlistId && wishlistData && wishlistMode)}
      />

      {/* Welcome menu shown when no wishlist is loaded */}
      {(!wishlistId || !wishlistData) && !wishlistMode && (
        <WelcomeMenu
          onCreateWishlist={handleCreateWishlist}
          onLoadWishlist={handleLoadWishlist}
          initialWishlistId={
            new URLSearchParams(window.location.search).get("id") || ""
          }
        />
      )}

      {/* Wishlist mode menu after wishlist is loaded */}
      {wishlistId && wishlistData && !wishlistMode && (
        <WishlistModeMenu
          wishlistName={wishlistData.name}
          onSelectMode={(mode) => setWishlistMode(mode)}
        />
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
