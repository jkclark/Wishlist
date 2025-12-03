import React from "react";

interface NavbarProps {
  wishlistName?: string;
  onNewLoad: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wishlistName, onNewLoad }) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{wishlistName || "Wishlist"}</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-primary" onClick={onNewLoad}>
          New/Load Wishlist
        </button>
      </div>
    </div>
  );
};

export default Navbar;
