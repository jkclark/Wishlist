import type { WishlistItemData } from "@wishlist/common";
import React, { useEffect, useRef, useState } from "react";

interface EditItemModalProps {
  isOpen: boolean;
  item?: WishlistItemData;
  isEditingNewItem: boolean;
  onClose: () => void;
  onSave: (item: WishlistItemData) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  item,
  isEditingNewItem,
  onClose,
  onSave,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");

  const [buttonText, setButtonText] = useState("Save");
  const [modalTitle, setModalTitle] = useState("Edit Item");

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
      // Set button text and title when modal opens to prevent flickering
      setModalTitle(isEditingNewItem ? "Add Item" : "Edit Item");
      setButtonText(isEditingNewItem ? "Add Item" : "Save");

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
  }, [isOpen, item, isEditingNewItem]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, one period, or one comma (but not both)
    const filtered = value.replace(/[^0-9.,]/g, "");

    // Check for both period and comma
    const hasPeriod = filtered.includes(".");
    const hasComma = filtered.includes(",");

    if (hasPeriod && hasComma) {
      // Don't allow both - keep the existing value
      return;
    }

    // Prevent multiple decimal separators
    const periodCount = (filtered.match(/\./g) || []).length;
    const commaCount = (filtered.match(/,/g) || []).length;

    if (periodCount > 1 || commaCount > 1) {
      // Don't allow multiple separators
      return;
    }

    setPrice(filtered);
  };

  const handleSave = () => {
    // Convert comma to period for parsing if needed
    // Necessary because parseFloat does not handle
    // European format where comma is used as decimal separator
    const normalizedPrice = price.replace(",", ".");

    const updatedItem: WishlistItemData = {
      name,
      link,
      price: parseFloat(normalizedPrice) || 0,
      bought: item?.bought || false,
      received: item?.received || false,
    };
    onSave(updatedItem);
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="mb-4 text-xl font-bold">{modalTitle}</h3>

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
            <span className="label-text">Price (optional)</span>
          </label>
          <div className="relative">
            <span className="text-base-content pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 transform opacity-60">
              $
            </span>
            <input
              type="text"
              className="input input-bordered w-full pl-7"
              value={price}
              onChange={handlePriceChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {buttonText}
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
