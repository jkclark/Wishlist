import React from "react";

import type { WishlistItemData } from "@wishlist/common";
import type { WishlistMode } from "../App";

interface WishlistItemProps extends WishlistItemData {
  mode: WishlistMode;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ mode, name, link, price, bought, received }) => {
  return (
    <tr>
      <td className="font-semibold">{name}</td>
      <td>
        <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
          View Item
        </a>
      </td>
      <td className="font-bold text-primary">${price.toFixed(2)}</td>
      {mode === "gifter" && (
        <td>
          <span className={`badge ${bought ? "badge-success" : "badge-neutral"}`}>
            {bought ? "Yes" : "No"}
          </span>
        </td>
      )}
      {mode === "owner" && (
        <td>
          <span className={`badge ${received ? "badge-success" : "badge-neutral"}`}>
            {received ? "Yes" : "No"}
          </span>
        </td>
      )}
    </tr>
  );
};

export default WishlistItem;
