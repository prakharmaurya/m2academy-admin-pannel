import React, { useState, useEffect, useContext } from 'react';
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
} from '../utils/api';
import { BsTrash } from 'react-icons/bs';
import { MdOutlineClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Context } from '../App';
import Loader from '../components/ui/Loader';

const Home = () => {
  const { setIsShowSnack, setSnackDetail } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState('');
  const [error, setError] = useState('');

  const createBoard = async (event) => {
    event.preventDefault();
    try {
      // console.log(board);
      const res = await createNewCategory({ name: board, tag: 'Board' });
      // console.log(res);
      setIsOpen(false);
      fetchBoards();
    } catch (err) {
      console.log(err);
      setIsOpen(false);
      if (err.response) {
        if (err.response.data) {
          setIsShowSnack(true);
          setSnackDetail({ type: 'error', msg: err.response.data.message });
        }
      }
    }
  };

  const delBoard = async (id) => {
    setLoading(true);
    try {
      await deleteACategory(id);
      fetchBoards();
      setIsShowSnack(true);
      setSnackDetail({ type: 'success', msg: 'Board deleted successfully' });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          setIsShowSnack(true);
          setSnackDetail({ type: 'error', msg: err.response.data.message });
        }
      }
    }
    setLoading(false);
  };

  const fetchBoards = async () => {
    setLoading(true);
    try {
      setError('');
      const res = await getAllCategory();
      // console.log(res.data);
      const b = [];
      res.data.forEach((element) => {
        if (element.category_id === 0 && element.tag === 'board') {
          b.push(element);
        }
      });
      // console.log(b);
      setBoards(b);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setIsShowSnack(true);
          setSnackDetail({ type: 'error', msg: err.response.data.message });
        }
        if (err.response.data.message === 'no boards found') {
          setBoards([]);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div>
      <div className="max-w-7xl container mx-auto px-4 py-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold">Boards</h3>
          <div className="flex gap-1">
            <button
              className="px-5 py-1.5 border border-blue-600 text-blue-600 rounded-sm"
              onClick={() => navigate('/slides')}
            >
              Slides
            </button>
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
              onClick={() => setIsOpen(true)}
            >
              Create Board
            </button>
          </div>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 && !boards.length > 0 && (
          <div className="h-96 flex justify-center items-center">
            <div>
              <p className="mb-5 capitalize text-xl font-semibold">{error}</p>
              <button
                className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                onClick={() => setIsOpen(true)}
              >
                Create Board
              </button>
            </div>
          </div>
        )}
        {/* ------- All Board list ------------ */}
        {boards.length > 0 && (
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
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delBoard(board.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                  <div className="my-2 border-b border-b-gray-600/50 opacity-30"></div>
                  <button
                    className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black"
                    onClick={() => navigate(`/${board.id}`)}
                  >
                    Classess
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------ Create Board Pop up ------------------ */}
        {isOpen && (
          <div
            className={`${
              isOpen
                ? 'transition-all duration-[6s] opacity-100 translate-y-0'
                : 'transition-all duration-[6s] opacity-0 translate-y-[200%]'
            } fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center`}
          >
            <div className="relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=" flex justify-center">
                <div className="px-3 py-8 w-full">
                  <p className="text-center text-xl text-blue-500 font-semibold">
                    Create Board
                  </p>
                  <form
                    onSubmit={createBoard}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Board Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Board Name"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setBoard(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Home;
