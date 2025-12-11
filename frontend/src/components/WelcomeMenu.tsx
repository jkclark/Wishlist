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
    <div className="flex flex-col items-center justify-center px-4 select-none">
      <div className="mb-4 max-w-md text-center">
        <h2 className="text-base-content mb-4 text-xl font-bold md:text-2xl">
          Welcome to Josh's wishlist app
        </h2>
        <p className="text-base-content opacity-70">
          You can create a new wishlist or load an existing one.
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
