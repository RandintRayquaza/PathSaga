import React from 'react';

const imges = [
  {
    id: 1,
    url: "/illustration01.png"
  },
  {
    id: 2,
    url: "/illustration02.png"
  }
];

export default function IllustrationBlock({ className = '', label = '' }) {
  // Map label to image. Hero uses "Career", Problem uses "Student".
  const imageToUse = label.toLowerCase().includes('student') ? imges[1] : imges[0];

  return (
    <div
      className={`relative rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center group ${className}`}
      aria-label={label}
      aria-hidden={!label}
    >
      <img
        src={imageToUse.url}
        alt={label}
        className="w-full h-full object-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
}
