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

      {/* Mobile card view */}
      <div className="block md:hidden space-y-4">
        {items.map((item, index) => (
          <div key={index} className={`card bg-base-200 shadow-sm ${item.received ? "opacity-50" : ""}`}>
            <div className="card-body p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold ${item.received ? "line-through" : ""}`}>{item.name}</h3>
                {!item.received && (
                  <button className="btn btn-sm btn-ghost" onClick={() => onEditItem(item, index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-lg">${item.price.toFixed(2)}</div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary btn btn-sm btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                </a>
              </div>
              <div className="flex justify-between gap-4">
                {mode === "gifter" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.bought}
                      className="checkbox checkbox-sm"
                      onChange={async () => {
                        const updatedItem = {
                          ...item,
                          bought: !item.bought,
                        };
                        await updateItem(index, updatedItem);
                      }}
                      disabled={item.received}
                    />
                    <span className="text-sm">Bought</span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.received}
                    className="checkbox checkbox-sm"
                    onChange={async () => {
                      const updatedItem = {
                        ...item,
                        received: !item.received,
                      };
                      await updateItem(index, updatedItem);
                    }}
                    disabled={mode !== "owner"}
                  />
                  <span className={`text-sm ${mode !== "owner" ? "opacity-50" : ""}`}>Received</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
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
    </div>
  );
};

export default Wishlist;
