import React from "react";

interface WishlistModeMenuProps {
  wishlistName: string;
  onSelectMode: (mode: "owner" | "gifter") => void;
}

const WishlistModeMenu: React.FC<WishlistModeMenuProps> = ({ wishlistName, onSelectMode }) => {
  return (
    <div className="max-w-2xl w-full mx-auto h-[200px]">
      <div className="card h-full">
        <div className="card-body">
          <div className="flex flex-col justify-center h-full gap-8 items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-2xl font-medium text-center">Choose wishlist mode</h2>
              <h3 className="text-center">Wishlist: {wishlistName}</h3>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <button className="btn btn-primary flex-1" onClick={() => onSelectMode("owner")}>
                This is my wishlist
              </button>

              <button className="btn btn-secondary flex-1" onClick={() => onSelectMode("gifter")}>
                I'm buying a gift
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistModeMenu;
