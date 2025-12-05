import React, { useState } from "react";

interface NewOrLoadMenuProps {
  onCreateWishlist: (name: string) => void;
  onLoadWishlist: (id: string) => void;
}

const NewOrLoadMenu: React.FC<NewOrLoadMenuProps> = ({
  onCreateWishlist,
  onLoadWishlist,
}) => {
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistId, setWishlistId] = useState("");

  const handleCreate = () => {
    if (wishlistName.trim()) {
      onCreateWishlist(wishlistName.trim());
    }
  };

  const handleLoad = () => {
    if (wishlistId.trim()) {
      onLoadWishlist(wishlistId.trim());
    }
  };

  // TODO: Need to lay this out vertically for mobile

  return (
    <div className="mx-auto h-[300px] w-full max-w-4xl">
      <div className="card h-full">
        <div className="card-body">
          {/* Mobile Layout - Vertical */}
          <div className="flex h-full flex-col justify-center md:hidden">
            {/* Load Section */}
            <div className="mb-4 flex flex-col items-center gap-4">
              <label className="label-text text-xl font-medium">Load</label>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={wishlistId}
                  onChange={(e) => setWishlistId(e.target.value)}
                  placeholder="Enter wishlist ID"
                />
                <button
                  className="btn btn-secondary w-16"
                  onClick={handleLoad}
                  disabled={!wishlistId.trim()}
                >
                  Load
                </button>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="divider mb-6 text-lg"></div>

            {/* Create Section */}
            <div className="flex flex-col items-center gap-4">
              <label className="label-text text-xl font-medium">Create</label>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={wishlistName}
                  onChange={(e) => setWishlistName(e.target.value)}
                  placeholder="Josh's Wishlist"
                />
                <button
                  className="btn btn-primary w-16"
                  onClick={handleCreate}
                  disabled={!wishlistName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden h-full items-center justify-between md:flex">
            {/* Load Section */}
            <div className="flex flex-1 flex-col items-center gap-6">
              <label className="label-text text-xl font-medium">Load</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={wishlistId}
                  onChange={(e) => setWishlistId(e.target.value)}
                  placeholder="Enter wishlist ID"
                />
                <button
                  className="btn btn-secondary w-20"
                  onClick={handleLoad}
                  disabled={!wishlistId.trim()}
                >
                  Load
                </button>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="divider divider-horizontal text-lg">OR</div>

            {/* Create Section */}
            <div className="flex flex-1 flex-col items-center gap-6">
              <label className="label-text text-xl font-medium">Create</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={wishlistName}
                  onChange={(e) => setWishlistName(e.target.value)}
                  placeholder="My Birthday Wishlist"
                />
                <button
                  className="btn btn-primary w-20"
                  onClick={handleCreate}
                  disabled={!wishlistName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrLoadMenu;
