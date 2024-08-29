// components/SimpleButton.tsx

"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface SimpleButtonProps {
  text: string;
  icon?: LucideIcon;  // 新增图标属性，可选
  onClick?: () => void;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({ text, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
    >
      {Icon && <Icon className="mr-2" size={20} />} {/* 如果有图标，渲染图标 */}
      {text}
    </button>
  );
};

export default SimpleButton;
