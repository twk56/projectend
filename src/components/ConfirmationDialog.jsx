import React from "react";
import { motion } from "framer-motion";

const dialogVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const ConfirmationDialog = ({ open, title, content, onConfirm, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/95 w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden border border-gray-100/50"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-600 text-base leading-relaxed">{content}</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md"
          >
            ยืนยัน
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ConfirmationDialog);
