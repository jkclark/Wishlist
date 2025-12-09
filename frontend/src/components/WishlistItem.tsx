import React from "react";

import type { WishlistItemData } from "@wishlist/common";
import type { WishlistMode } from "../App";

interface WishlistItemProps extends WishlistItemData {
  mode: WishlistMode;
  onUpdate: (updatedItem: WishlistItemData) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
  renderMode: "mobile" | "desktop";
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  mode,
  name,
  link,
  price,
  bought,
  received,
  notes,
  onUpdate,
  onEdit,
  onDelete,
  renderMode,
}) => {
  const handleBoughtChange = async () => {
    const updatedItem: WishlistItemData = {
      name,
      link,
      price,
      bought: !bought,
      received,
      notes,
    };
    await onUpdate(updatedItem);
  };

  const handleReceivedChange = async () => {
    const updatedItem: WishlistItemData = {
      name,
      link,
      price,
      bought: !received ? true : bought,
      received: !received,
      notes,
    };
    await onUpdate(updatedItem);
  };

  const shouldStrikeThroughText = (
    bought: boolean,
    received: boolean,
    mode: WishlistMode,
  ) => {
    return (mode === "gifter" && bought) || received;
  };

  if (renderMode === "desktop") {
    return (
      <tr className={received ? "opacity-50" : ""}>
        <td
          className={`${shouldStrikeThroughText(bought, received, mode) ? "line-through" : ""}`}
        >
          {name}
        </td>
        <td>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary flex justify-center"
            >
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
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </a>
          )}
        </td>
        <td
          className={`${shouldStrikeThroughText(bought, received, mode) ? "line-through" : ""}`}
        >
          {isNaN(price) || price <= 0 ? "" : `${price.toFixed(2)}`}
        </td>
        <td className="max-w-50">
          {notes && (
            <span className="text-base-content/70 text-sm break-words">
              {notes}
            </span>
          )}
        </td>
        {mode === "gifter" && (
          <td className="text-center">
            <input
              type="checkbox"
              checked={bought || received} // If received, we want to check bought as well
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

        <td>
          <div className="flex">
            {/* Edit button */}
            {mode === "owner" && !received && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={onEdit}
                disabled={received}
              >
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
            {/* Delete button */}
            {mode === "owner" && !received && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={onDelete}
                disabled={received}
              >
                {/* Heroicons trash */}
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // Mobile card view
  return (
    <div
      className={`card bg-base-200 shadow-sm ${received ? "opacity-50" : ""}`}
    >
      <div className="card-body p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3
            className={`${shouldStrikeThroughText(bought, received, mode) ? "line-through" : ""}`}
          >
            {name}
          </h3>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <div
            className={`text-lg ${shouldStrikeThroughText(bought, received, mode) ? "line-through" : ""}`}
          >
            {isNaN(price) || price <= 0 ? "$ —" : `$${price.toFixed(2)}`}
          </div>
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
                className="size-5"
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
        {notes && (
          <div className="mb-2">
            <p className="text-base-content/70 text-sm">{notes}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          {mode === "gifter" && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={bought || received} // If received, we want to check bought as well
                className="checkbox checkbox-sm"
                onChange={handleBoughtChange}
                disabled={received}
              />
              <span className="text-sm">Bought</span>
            </label>
          )}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={received}
              className="checkbox checkbox-sm"
              onChange={handleReceivedChange}
              disabled={mode !== "owner"}
            />
            <span className="text-sm opacity-50">Received</span>
          </label>
          {mode === "owner" && !received && (
            <div className="flex gap-0">
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
              <button
                className="btn btn-sm btn-ghost"
                onClick={onDelete}
                disabled={received}
              >
                {/* Heroicons trash */}
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
