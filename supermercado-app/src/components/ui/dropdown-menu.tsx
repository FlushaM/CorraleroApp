import React, { useState } from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <button className="focus:outline-none">{children}</button>;
};

export const DropdownMenuContent: React.FC<{ 
  children: React.ReactNode; 
  align?: "start" | "end"; 
}> = ({ children, align = "start" }) => {
  const alignment = align === "start" ? "left-0" : "right-0";
  return (
    <div className={`absolute ${alignment} mt-2 w-48 bg-white shadow-md rounded border border-gray-200`}>
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
    >
      {children}
    </div>
  );
};
