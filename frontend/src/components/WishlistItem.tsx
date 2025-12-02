import React from "react";

import type { WishlistItemData } from "@wishlist/common";
import type { WishlistMode } from "../App";

interface WishlistItemProps extends WishlistItemData {
  mode: WishlistMode;
  onUpdate: (updatedItem: WishlistItemData) => Promise<void>;
  onEdit: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  mode,
  name,
  link,
  price,
  bought,
  received,
  onUpdate,
  onEdit,
}) => {
  const handleBoughtChange = async () => {
    const updatedItem: WishlistItemData = {
      name,
      link,
      price,
      bought: !bought,
      received,
    };
    await onUpdate(updatedItem);
  };

  const handleReceivedChange = async () => {
    const updatedItem: WishlistItemData = {
      name,
      link,
      price,
      bought,
      received: !received,
    };
    await onUpdate(updatedItem);
  };

  return (
    <>
      {/* Desktop table row */}
      <tr className={`hidden md:table-row ${received ? "opacity-50" : ""}`}>
        {/* Edit button */}
        <td>
          {!received && (
            <button className="btn btn-sm btn-ghost" onClick={onEdit} disabled={received}>
              {/* Heroicons pencil in square */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}
        </td>

        <td className={`font-semibold ${received ? "line-through" : ""}`}>{name}</td>
        <td>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="link link-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </a>
          )}
        </td>
        <td className="font-bold">${price.toFixed(2)}</td>
        {mode === "gifter" && (
          <td className="text-center">
            <input
              type="checkbox"
              checked={bought}
              className="checkbox"
              onChange={handleBoughtChange}
              disabled={received}
            />
          </td>
        )}
        <td className="text-center">
          <input
            type="checkbox"
            checked={received}
            className="checkbox"
            onChange={handleReceivedChange}
            disabled={mode !== "owner"}
          />
        </td>
      </tr>

      {/* Mobile card view */}
      <div className={`md:hidden card bg-base-200 shadow-sm ${received ? "opacity-50" : ""}`}>
        <div className="card-body p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-semibold ${received ? "line-through" : ""}`}>{name}</h3>
            {!received && (
              <button className="btn btn-sm btn-ghost" onClick={onEdit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">${price.toFixed(2)}</div>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary btn btn-sm btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
              </a>
            )}
          </div>
          <div className="flex justify-between gap-4">
            {mode === "gifter" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bought}
                  className="checkbox checkbox-sm"
                  onChange={handleBoughtChange}
                  disabled={received}
                />
                <span className="text-sm">Bought</span>
              </label>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={received}
                className="checkbox checkbox-sm"
                onChange={handleReceivedChange}
                disabled={mode !== "owner"}
              />
              <span className={`text-sm ${mode !== "owner" ? "opacity-50" : ""}`}>Received</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistItem;
