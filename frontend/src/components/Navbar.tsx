import React from "react";
import ShareButton from "./ShareButton";

interface NavbarProps {
  wishlistId?: string;
  wishlistName?: string;
  onNewLoad: () => void;
  showNavbarContents: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  wishlistId,
  wishlistName,
  onNewLoad,
  showNavbarContents,
}) => {
  // For now, don't do anything with ID. This console.log is here to allow
  // the build to succeed without "unused variable" errors.
  console.log("Rendering navbar with wishlist ID:", wishlistId);

  return (
    <div className="navbar bg-base-100">
      {/* Left side - Wishlist name */}
      <div className="navbar-start flex-1">
        {showNavbarContents && wishlistName && (
          <span className="px-4 text-lg font-medium md:text-xl">
            {wishlistName}
          </span>
        )}
      </div>

      {/* Right side - hamburger menu on mobile, button on desktop */}
      <div className="navbar-end flex flex-0 gap-2">
        {showNavbarContents && (
          <>
            {/* Mobile hamburger menu */}
            <div className="dropdown dropdown-end md:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box bg-base-200 z-[1] w-36 gap-1 border border-b border-gray-500 p-2 shadow"
              >
                <li>
                  <button
                    className="btn btn-ghost bg-base-300 flex justify-end"
                    onClick={onNewLoad}
                  >
                    New/Load Wishlist
                  </button>
                </li>
                <li>
                  {wishlistName && (
                    <ShareButton
                      wishlistName={wishlistName}
                      className="bg-base-300 btn-ghost flex justify-end"
                    />
                  )}
                </li>
              </ul>
            </div>

            {/* Desktop menu */}
            {wishlistName && (
              <ShareButton
                wishlistName={wishlistName}
                className="hidden md:flex"
              />
            )}
            <button className="btn hidden md:flex" onClick={onNewLoad}>
              New/Load Wishlist
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
