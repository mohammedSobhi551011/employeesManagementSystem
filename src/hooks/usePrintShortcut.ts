import { useEffect } from "react";

type PrintShortcutOptions = {
  onPrint: () => void;
};

export const usePrintShortcut = ({ onPrint }: PrintShortcutOptions): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintShortcut =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "p" || e.key.toLocaleLowerCase() === "ح");

      if (isPrintShortcut) {
        e.preventDefault(); // stop default browser print
        onPrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrint]);
};
