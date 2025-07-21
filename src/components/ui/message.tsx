'use client'

import React, { useEffect, useState } from 'react';

interface MessageBoxProps {
  children: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'gray';
  className?: string;
}

export default function MessageBox({ children, color, className = '' }: MessageBoxProps) {
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

  useEffect(() => {
    setVisible(true);
  }, [children]);

  return (
    <div
      className={`rounded-xl ${bg} border ${border} px-4 py-2.5 ${text} shadow-sm ${className} cursor-pointer`}
      role="alert"
      onClick={() => setVisible(false)}
      title="Click to dismiss">
      {children}
    </div>
  );
}
