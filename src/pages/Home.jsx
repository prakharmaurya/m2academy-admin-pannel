import React, { useState, useEffect } from 'react';
import { getBoards } from '../utils/api';
import { BsTrash } from 'react-icons/bs';

const Home = () => {
  const [boards, setBoards] = useState([]);

  const fetchBoards = async () => {
    try {
      const res = await getBoards();
      console.log(res);
      setBoards(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);
  return (
    <div>
      <div className="max-w-7xl container mx-auto px-4 py-5">
        {boards.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold">Boards</h3>
            <div className="py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {boards.map((board) => {
                return (
                  <div
                    key={board.id}
                    className="bg-blue-50 px-3 py-5 rounded-md border border-blue-300"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="uppercase text-xl font-semibold">
                        {board.name}
                      </h4>
                      <button className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2">
                        <BsTrash size={20} />
                      </button>
                    </div>
                    <div className="my-2 border-b border-b-gray-600/50 opacity-30"></div>
                    <button className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black">
                      Classess
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
