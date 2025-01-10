import React from 'react';
import '../index.css';
function DarkRoundButton() {
  return (
    <>
      <div className="w-72 self-center sm:mt-0">
        <button
          type="button"
          className="button-custom-stroke w-full rounded-full border bg-[#172635] px-20 py-2 text-center text-white"
        >
          홈으로
        </button>
      </div>
    </>
  );
}

export default DarkRoundButton;
