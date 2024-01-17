import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center h-fulll">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
