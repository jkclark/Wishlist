import React from "react";

interface WishlistModeMenuProps {
  wishlistName: string;
  onSelectMode: (mode: "owner" | "gifter") => void;
}

const WishlistModeMenu: React.FC<WishlistModeMenuProps> = ({
  wishlistName,
  onSelectMode,
}) => {
  return (
    <div className="mx-auto h-[200px] w-full max-w-2xl">
      <div className="card h-full">
        <div className="card-body">
          <div className="flex h-full flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center justify-center gap-2">
              <h2 className="text-center text-2xl font-medium">
                Choose wishlist mode
              </h2>
              <h3 className="text-center">Wishlist: {wishlistName}</h3>
            </div>

            <div className="flex w-full max-w-md gap-4">
              <button
                className="btn btn-primary flex-1"
                onClick={() => onSelectMode("owner")}
              >
                This is my wishlist
              </button>

              <button
                className="btn btn-secondary flex-1"
                onClick={() => onSelectMode("gifter")}
              >
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
