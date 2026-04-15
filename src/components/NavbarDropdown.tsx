import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type DropdownItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive: boolean;
};
type DropdownLabel = {
  isActive: boolean;
  name: string;
};

type NavbarDropdownProps = {
  label: DropdownLabel;
  items: DropdownItem[];
};

export const NavbarDropdown = ({ label, items }: NavbarDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Main Button */}
      <button
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${label.isActive ? "text-blue-700 bg-white" : "hover:bg-blue-700 text-blue-100"}`}
      >
        {label.name}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 p-2"
          >
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href || "#"}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`block rounded-lg px-4 py-2 text-sm ${item.isActive ? "bg-blue-600 hover:bg-blue-800 text-white" : "text-blue-700 hover:bg-gray-100"}`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
