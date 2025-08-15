import React from "react";
import { AnimatePresence, motion} from "framer-motion";
import {
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleRight,
} from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisible = 5;

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-40"
      >
        <HiChevronDoubleLeft size={20} />
      </button>

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-40"
      >
        <HiChevronLeft size={20} />
      </button>

      {/* Page Numbers with Animation */}
      <AnimatePresence mode="sync">
        {pages.map((page) => (
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`px-4 py-2 rounded border transition-all duration-200 ${
              page === currentPage
                ? "bg-green-400 text-black font-medium scale-105"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-40"
      >
        <HiChevronRight size={20} />
      </button>

      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-40"
      >
        <HiChevronDoubleRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
