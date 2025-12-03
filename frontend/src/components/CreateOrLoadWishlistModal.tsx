import React, { useEffect, useRef, useState } from "react";

interface CreateOrLoadWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (wishlistName: string) => void;
  onLoad: (wishlistId: string) => void;
}

const CreateOrLoadWishlistModal: React.FC<CreateOrLoadWishlistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onLoad,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"create" | "load">("create");
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistId, setWishlistId] = useState("");

  // Control dialog open/close state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWishlistName("");
      setWishlistId("");
      setActiveTab("create");
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (wishlistName.trim()) {
      onCreate(wishlistName.trim());
      onClose();
    }
  };

  const handleLoad = () => {
    if (wishlistId.trim()) {
      onLoad(wishlistId.trim());
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-6">Wishlist</h3>

        {/* Tab navigation */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create New
          </button>
          <button
            className={`tab ${activeTab === "load" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("load")}
          >
            Load Existing
          </button>
        </div>

        {/* Create tab content */}
        {activeTab === "create" && (
          <div>
            <div className="form-control mb-6">
              <label className="label mb-1">
                <span className="label-text">Wishlist Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                placeholder="My Birthday Wishlist"
                autoFocus
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={onClose}>
                  Cancel
                </button>
              </form>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!wishlistName.trim()}>
                Create Wishlist
              </button>
            </div>
          </div>
        )}

        {/* Load tab content */}
        {activeTab === "load" && (
          <div>
            <div className="form-control mb-6">
              <label className="label mb-1">
                <span className="label-text">Wishlist ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={wishlistId}
                onChange={(e) => setWishlistId(e.target.value)}
                placeholder="Enter wishlist ID or URL"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={onClose}>
                  Cancel
                </button>
              </form>
              <button className="btn btn-primary" onClick={handleLoad} disabled={!wishlistId.trim()}>
                Load Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateOrLoadWishlistModal;
