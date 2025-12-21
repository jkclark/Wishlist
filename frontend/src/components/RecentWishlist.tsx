import React from "react";

export interface RecentWishlistProps {
  id: string;
  name: string;
  lastAccessed: string;
  onClick?: () => void;
}

const RecentWishlist: React.FC<RecentWishlistProps> = ({
  id,
  name,
  lastAccessed,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="bg-base-200 rounded-md p-3">
      <div>
        <strong>{name}</strong> <br />
        <span>ID: {id}</span> <br />
        <span>Last Accessed: {new Date(lastAccessed).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default RecentWishlist;
