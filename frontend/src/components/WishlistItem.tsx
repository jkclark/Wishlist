import type { WishlistItemData } from "@wishlist/common";
import React from "react";

const WishlistItem: React.FC<WishlistItemData> = ({ name, link, price }) => {
  return (
    <div className="card bg-base-100 shadow-md p-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
        </div>
        <div className="flex-shrink-0">
          <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            View Item
          </a>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
