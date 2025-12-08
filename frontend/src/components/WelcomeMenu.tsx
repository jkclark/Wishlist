import React from "react";
import NewOrLoadMenu from "./NewOrLoadMenu";

interface WelcomeMenuProps {
  onCreateWishlist: (name: string) => Promise<void>;
  onLoadWishlist: (id: string) => Promise<void>;
  initialWishlistId?: string;
}

const WelcomeMenu: React.FC<WelcomeMenuProps> = ({
  onCreateWishlist,
  onLoadWishlist,
  initialWishlistId,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="mb-4 max-w-md text-center">
        <h2 className="text-base-content mb-4 text-2xl font-bold">
          Welcome to the wishlist app
        </h2>
        <p className="text-base-content opacity-70">
          You can load an existing wishlist or create a new one.
        </p>
      </div>
      <NewOrLoadMenu
        onCreateWishlist={onCreateWishlist}
        onLoadWishlist={onLoadWishlist}
        initialWishlistId={initialWishlistId}
      />
    </div>
  );
};

export default WelcomeMenu;
