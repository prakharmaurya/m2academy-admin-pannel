import React from 'react';

import { AiOutlineClose } from 'react-icons/ai';

const Snackbar = ({ type = 'info', message, closeSnackbar }) => {
  return (
    <div>
      <div
        className={`${type === 'info' && 'bg-gray-200 text-black'} ${
          type === 'error' && 'bg-red-500 text-white'
        } ${
          type === 'success' && 'bg-green-500 text-white'
        } fixed bottom-5 right-5 z-50 px-5 py-5 rounded`}
      >
        <div className="flex gap-5 justify-between items-center">
          <p className="text-sm font-medium">{message}</p>
          <AiOutlineClose className="cursor-pointer" onClick={closeSnackbar} />
        </div>
      </div>
    </div>
  );
};

export default Snackbar;
