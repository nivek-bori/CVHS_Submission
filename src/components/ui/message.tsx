import React from 'react';

interface MessageBoxProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // Tailwind color e.g. 'blue', 'red', 'green', 'yellow', etc.
}

export default function MessageBox({ children, color, className = ''}: MessageBoxProps) {
  let bg = 'bg-white', border = 'border-gray-300', text = 'text-gray-800';
  if (color === 'gray') {
    bg = 'bg-gray-100'; border = 'border-gray-400'; text = 'text-gray-800';
  } else if (color === 'green') {
    bg = 'bg-green-100'; border = 'border-green-400'; text = 'text-green-800';
  } else if (color === 'red') {
    bg = 'bg-red-100'; border = 'border-red-400'; text = 'text-red-800';
  }

  return (
    <div
      className={`rounded-xl ${bg} border ${border} px-4 py-2.5 ${text} shadow-sm ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
