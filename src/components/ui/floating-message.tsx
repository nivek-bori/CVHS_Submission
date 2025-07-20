import React, { useState } from 'react';

interface FloatingMessageProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // Tailwind color e.g. 'blue', 'red', 'green', 'yellow', etc.
}

export default function FloatingMessage({ children, color, className = '' }: FloatingMessageProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  // default is white
  let bg = 'bg-white';
  let border = 'border-gray-300';
  let text = 'text-gray-800';

  // gray, green, red, blue
  if (color === 'gray') {
    bg = 'bg-gray-100';
    border = 'border-gray-400';
    text = 'text-gray-800';
  } else if (color === 'blue') {
    bg = 'bg-blue-100';
    border = 'border-blue-400';
    text = 'text-blue-800';
  } else if (color === 'green') {
    bg = 'bg-green-100';
    border = 'border-green-400';
    text = 'text-green-800';
  } else if (color === 'red') {
    bg = 'bg-red-100';
    border = 'border-red-400';
    text = 'text-red-800';
  }
  
  return (
    <div
      className={`absolute top-10 right-10 left-10 z-100 rounded-xl ${bg} border-[0.12rem] ${border} px-4 py-2.5 ${text} flex items-center justify-between shadow-md ${className}`}
      role="alert">
      <span>{children}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 rounded px-2 py-1 text-lg font-bold text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
        aria-label="Close"
        type="button">
        ×
      </button>
    </div>
  );
}
