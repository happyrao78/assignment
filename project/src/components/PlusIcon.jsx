import React from 'react';

function PlusIcon({ onClick }) {
  return (
    <div 
      className="fixed bottom-10 right-10 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-2xl"
      onClick={onClick}
    >
      +
    </div>
  );
}

export default PlusIcon;
