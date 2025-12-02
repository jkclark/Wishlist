import type { WishlistItemData } from "@wishlist/common";
import React from "react";
import WishlistItem from "./WishlistItem";

interface WishlistProps {
  name: string;
  items: WishlistItemData[];
}

const Wishlist: React.FC<WishlistProps> = ({ name, items }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <h2 className="text-3xl font-bold text-base-content mb-6">{name}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <WishlistItem key={index} name={item.name} link={item.link} price={item.price} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
