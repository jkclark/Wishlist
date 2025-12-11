import React, { useEffect, useState } from "react";
import { WishlistNotFoundError } from "../wishlist_storage/WishlistStore";

interface NewOrLoadMenuProps {
  onCreateWishlist: (name: string) => Promise<void>;
  onLoadWishlist: (id: string) => Promise<void>;
  initialWishlistId?: string;
}

const NewOrLoadMenu: React.FC<NewOrLoadMenuProps> = ({
  onCreateWishlist,
  onLoadWishlist,
  initialWishlistId,
}) => {
  // Data
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistId, setWishlistId] = useState(initialWishlistId || "");

  // Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const loadingElement = (
    <span className="loading loading-spinner loading-md"></span>
  );

  // Error
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // Auto-load wishlist if initialWishlistId is provided
  useEffect(() => {
    if (initialWishlistId && initialWishlistId.trim()) {
      handleLoad();
    }
  }, [initialWishlistId]);

  const handleCreate = async () => {
    if (wishlistName.trim() && !isCreating) {
      setIsCreating(true);

      try {
        await onCreateWishlist(wishlistName.trim());
        setCreateError(null);
      } catch (error: any) {
        setCreateError("An unexpected error occurred. Please try again later.");
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleLoad = async () => {
    if (wishlistId.trim() && !isLoading) {
      setIsLoading(true);

      try {
        await onLoadWishlist(wishlistId.trim());
        setLoadError(null);
      } catch (error: any) {
        if (error instanceof WishlistNotFoundError) {
          setLoadError(
            "Wishlist not found. Please check the ID and try again.",
          );
        } else {
          setLoadError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto h-[300px] w-full max-w-4xl">
      <div className="card h-full">
        <div className="card-body">
          {/* Mobile Layout - Vertical */}
          <div className="flex h-full flex-col justify-center md:hidden">
            {/* Create Section */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xl font-medium">Create</span>
              <div className="flex h-[50px] w-full gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={wishlistName}
                    onChange={(e) => setWishlistName(e.target.value)}
                    placeholder="Josh's Wishlist"
                  />
                  {createError && (
                    <div className="text-error mt-1 ml-1 text-xs">
                      {createError}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary w-16"
                  onClick={handleCreate}
                  disabled={!wishlistName.trim() || isCreating}
                >
                  {isCreating ? loadingElement : "Create"}
                </button>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="divider mb-6 text-lg"></div>

            {/* Load Section */}
            <div className="mb-4 flex flex-col items-center gap-4">
              <span className="text-xl font-medium">Load</span>
              <div className="flex h-[50px] w-full gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={wishlistId}
                    onChange={(e) => setWishlistId(e.target.value)}
                    placeholder="Enter wishlist ID"
                  />
                  {loadError && (
                    <div className="text-error mt-1 ml-1 text-xs">
                      {loadError}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-secondary w-16"
                  onClick={handleLoad}
                  disabled={!wishlistId.trim() || isLoading}
                >
                  {isLoading ? loadingElement : "Load"}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden h-full items-center justify-between md:flex">
            {/* Create Section */}
            <div className="flex flex-1 flex-col items-center gap-6">
              <span className="text-xl font-medium">Create</span>
              <div className="flex h-[100px] w-[300px] gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={wishlistName}
                    onChange={(e) => setWishlistName(e.target.value)}
                    placeholder="Josh's Wishlist"
                  />
                  {createError && (
                    <div className="text-error mt-1 ml-1 text-xs">
                      {createError}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary w-20"
                  onClick={handleCreate}
                  disabled={!wishlistName.trim() || isCreating}
                >
                  {isCreating ? loadingElement : "Create"}
                </button>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="divider divider-horizontal text-lg">OR</div>

            {/* Load Section */}
            <div className="flex flex-1 flex-col items-center gap-6">
              <span className="text-xl font-medium">Load</span>
              <div className="flex h-[100px] w-[300px] gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={wishlistId}
                    onChange={(e) => setWishlistId(e.target.value)}
                    placeholder="Enter wishlist ID"
                  />
                  {loadError && (
                    <div className="text-error mt-1 ml-1 text-xs">
                      {loadError}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-secondary w-20"
                  onClick={handleLoad}
                  disabled={!wishlistId.trim() || isLoading}
                >
                  {isLoading ? loadingElement : "Load"}
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
