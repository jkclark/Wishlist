import React from "react";

interface NavbarProps {
  wishlistName?: string;
  onNewLoad: () => void;
  showNavbarContents?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ wishlistName, onNewLoad, showNavbarContents: showUI = true }) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        {showUI && <a className="btn btn-ghost text-xl">{wishlistName || "Wishlist"}</a>}
      </div>
      {showUI && (
        <div className="flex-none">
          <button className="btn btn-primary" onClick={onNewLoad}>
            New/Load Wishlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
