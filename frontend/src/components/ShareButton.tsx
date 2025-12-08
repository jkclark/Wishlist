import React from "react";

interface ShareButtonProps {
  wishlistName: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ wishlistName }) => {
  const handleShare = async () => {
    // Check if the Web Share API is supported (iOS Safari, Android Chrome, etc.)
    // if (navigator.share) {
    if (false) {
      try {
        await navigator.share({
          title: wishlistName,
          text: `Check out this wishlist: ${wishlistName}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled the share or an error occurred
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      // Could implement custom share modal or copy to clipboard
      console.log("Web Share API not supported");
      // For now, just copy the URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Wishlist URL copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy URL to clipboard:", error);
      }
    }
  };

  return (
    <button className="btn btn-ghost" onClick={handleShare}>
      Share
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
          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
        />
      </svg>
    </button>
  );
};

export default ShareButton;
