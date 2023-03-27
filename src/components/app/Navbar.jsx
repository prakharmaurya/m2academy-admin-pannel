import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-blue-100 sticky top-0 z-20 h-20 flex items-center">
      <div className="max-w-7xl container mx-auto px-4">
        <div className="flex justify-between">
          <Link to="/" className="text-lg font-semibold">
            M2 Academy
          </Link>
          <button>
            <CgProfile size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
