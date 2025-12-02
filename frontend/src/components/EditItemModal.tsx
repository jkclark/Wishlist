import type { WishlistItemData } from "@wishlist/common";
import React, { useEffect, useRef, useState } from "react";

interface EditItemModalProps {
  isOpen: boolean;
  item?: WishlistItemData;
  isEditingNewItem: boolean;
  onClose: () => void;
  onSave: (item: WishlistItemData) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, item, isEditingNewItem, onClose, onSave }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");

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

  // Sync form state with item prop when modal opens
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name);
        setLink(item.link);
        setPrice(item.price.toString());
      } else {
        // Clear form for new item
        setName("");
        setLink("");
        setPrice("");
      }
    }
  }, [isOpen, item]);

  const handleSave = () => {
    const updatedItem: WishlistItemData = {
      name,
      link,
      price: parseFloat(price) || 0,
      bought: item?.bought || false,
      received: item?.received || false,
    };
    onSave(updatedItem);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-xl mb-4">{isEditingNewItem ? "Add Item" : "Edit Item"}</h3>

        <div className="form-control mb-6">
          <label className="label mb-1">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the name of the item"
          />
        </div>

        <div className="form-control mb-6">
          <label className="label mb-1">
            <span className="label-text">Link (optional)</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com/product-page"
          />
        </div>

        <div className="form-control mb-8">
          <label className="label mb-1">
            <span className="label-text">Price</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-60 z-10 pointer-events-none">
              $
            </span>
            <input
              type="number"
              className="input input-bordered w-full pl-7"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !price.trim()}>
            {isEditingNewItem ? "Add Item" : "Save"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default EditItemModal;
