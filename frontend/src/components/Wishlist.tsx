import React from "react";

import type { WishlistData, WishlistItemData } from "@wishlist/common";
import type { WishlistMode } from "../App";
import WishlistItem from "./WishlistItem";

interface WishlistProps {
  mode: WishlistMode;
  wishlistData: WishlistData;
  onSaveWishlist: (updatedWishlist: WishlistData) => Promise<void>;
  onEditItem: (item: WishlistItemData, index: number) => void;
  onDeleteItem: (item: WishlistItemData, index: number) => void;
  onAddItem: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  mode,
  wishlistData,
  onSaveWishlist,
  onEditItem,
  onDeleteItem,
  onAddItem,
}) => {
  const wishlistHasItems = wishlistData.items.length > 0;
  const updateItem = async (index: number, updatedItem: WishlistItemData) => {
    const updatedItems = [...wishlistData.items];
    updatedItems[index] = updatedItem;

    const updatedWishlist: WishlistData = {
      id: wishlistData.id,
      name: wishlistData.name,
      items: updatedItems,
    };

    await onSaveWishlist(updatedWishlist);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-6 sm:px-6 lg:px-8">
      {wishlistHasItems && (
        <div className="mb-4">
          {mode === "owner" && (
            <button className="btn btn-primary btn-sm" onClick={onAddItem}>
              Add Item
            </button>
          )}
        </div>
      )}

      {/* Desktop table view */}
      <div className="hidden overflow-x-auto md:block">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th>Price</th>
              {mode === "gifter" && <th className="text-center">Bought</th>}
              <th className="text-center">Received</th>
              <th className="w-1">{/* Edit column, w-1 forces min width */}</th>
            </tr>
          </thead>
          <tbody>
            {wishlistHasItems &&
              wishlistData.items.map((item, index) => (
                <WishlistItem
                  key={index}
                  mode={mode}
                  name={item.name}
                  link={item.link}
                  price={item.price}
                  bought={item.bought}
                  received={item.received}
                  onUpdate={(updatedItem) => updateItem(index, updatedItem)}
                  onEdit={() => onEditItem(item, index)}
                  onDelete={() => onDeleteItem(item, index)}
                  renderMode="desktop"
                />
              ))}
          </tbody>
        </table>
        {!wishlistHasItems && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="text-center text-gray-500">
              This wishlist has no items!
            </div>
            {mode === "owner" && (
              <button className="btn btn-primary w-30" onClick={onAddItem}>
                Add an item
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile card view */}
      <div className="space-y-4 md:hidden">
        {!wishlistHasItems && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-gray-500">
              This wishlist has no items!
            </div>
            {mode === "owner" && (
              <button className="btn btn-primary w-30" onClick={onAddItem}>
                Add an item
              </button>
            )}
          </div>
        )}
        {wishlistHasItems &&
          wishlistData.items.map((item, index) => (
            <WishlistItem
              key={index}
              mode={mode}
              name={item.name}
              link={item.link}
              price={item.price}
              bought={item.bought}
              received={item.received}
              onUpdate={(updatedItem) => updateItem(index, updatedItem)}
              onEdit={() => onEditItem(item, index)}
              onDelete={() => onDeleteItem(item, index)}
              renderMode="mobile"
            />
          ))}
      </div>
    </div>
  );
};

export default Wishlist;
