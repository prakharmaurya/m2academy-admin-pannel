import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookieConfig';

const Navbar = () => {
  const logout = () => {
    deleteCookie('token');
  };

  return (
    <div className="bg-blue-100 sticky top-0 z-20 h-20 flex items-center">
      <div className="max-w-7xl container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-lg font-semibold">
            M2 Academy
          </Link>

          <div className="relative group">
            <button>
              <CgProfile size={25} />
            </button>
            <div className="hidden group-hover:block absolute top-7 right-5 left-[50%] translate-x-[-50%] font-medium w-32 shadow-sm rounded-sm p-5 bg-white">
              <button onClick={logout}>Log out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
