import type React from "react";
import { useEffect, useRef } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-h-[80dvh]">
        <div className="pb-4 text-lg font-semibold md:pb-5 md:text-xl">
          An improvement to the gift-giving experience
        </div>
        <div className="flex flex-col gap-3 text-sm md:text-base">
          <p>
            Coming up with a gift for someone is often risky — you can't always
            know if they'll love it or not. If you get them something they don't
            like, nobody's happy. On the other hand, if they tell you exactly
            what they want, there's no surprise.
          </p>
          <p>
            This app aims to solve this problem by{" "}
            <strong>
              guaranteeing you'll give a gift they'll love without them knowing
              what it is.
            </strong>
          </p>
          <p>
            These wishlists work by hiding what's been bought from the wishlist
            owner. Here's an example:
          </p>

          <ol className="ml-8 list-decimal">
            <li>Madie has a wishlist and Josh wants to buy her something.</li>
            <li>Josh buys an item from the list and marks it as bought.</li>
            <li>
              Madie comes back to her wishlist to add another item{" "}
              <strong>
                but doesn't see that Josh marked the item as bought
              </strong>
              .
            </li>
            <li>
              Madie gets a gift she loves, because she picked it, but she didn't
              know what it was going to be.
            </li>
          </ol>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AboutModal;
