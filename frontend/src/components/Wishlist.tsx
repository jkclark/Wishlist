import React from "react";

import type { WishlistItemData } from "@wishlist/common";
import type { WishlistData, WishlistMode } from "../App";
import WishlistItem from "./WishlistItem";

interface WishlistProps {
  name: string;
  mode: WishlistMode;
  items: WishlistItemData[];
  onSaveWishlist: (updatedWishlist: WishlistData) => Promise<void>;
  onEditItem: (item: WishlistItemData, index: number) => void;
  onAddItem: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ name, mode, items, onSaveWishlist, onEditItem, onAddItem }) => {
  const updateItem = async (index: number, updatedItem: WishlistItemData) => {
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;

    const updatedWishlist: WishlistData = {
      name,
      items: updatedItems,
    };

    await onSaveWishlist(updatedWishlist);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-base-content">{name}</h2>
        <button className="btn btn-primary btn-sm" onClick={onAddItem}>
          Add item
        </button>
      </div>

      {/* Desktop */}
      <div className="space-y-4 md:space-y-0">
        <div className="hidden md:block overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1">{/* Edit column, w-1 forces min width */}</th>
                <th>Name</th>
                <th>Link</th>
                <th>Price</th>
                {mode === "gifter" && <th className="text-center">Bought</th>}
                <th className="text-center">Received</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
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
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {items.map((item, index) => (
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
