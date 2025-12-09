import React, { useState } from "react";

interface ShareButtonProps {
  wishlistName: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  wishlistName,
  className,
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    // Check if the Web Share API is supported (iOS Safari, Android Chrome, etc.)
    if (navigator.share) {
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
      console.log("Web Share API not supported");
      // Copy the URL to clipboard and show "Copied!" text
      try {
        await navigator.clipboard.writeText(window.location.href);

        // Show "Copied!" text with ping animation
        setShowCopied(true);

        // Hide the "Copied!" text after the ping animation completes (~1 second)
        setTimeout(() => {
          setShowCopied(false);
        }, 750);
      } catch (error) {
        console.error("Failed to copy URL to clipboard:", error);
        alert("Failed to copy URL to clipboard");
      }
    }
  };

  return (
    <button className={`btn ${className || ""}`} onClick={handleShare}>
      {showCopied ? (
        <span className="animate-ping">Copied!</span>
      ) : (
        <>
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
        </>
      )}
    </button>
  );
};

export default ShareButton;
