import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
} from '../../../../../utils/api';
import { MdOutlineClose } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';

const Label = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [labels, setLabels] = useState([]);
  const [inLabel, setInLabel] = useState('');
  const [error, setError] = useState('');

  const createLabel = async (event) => {
    event.preventDefault();
    try {
      const data = {
        name: inLabel,
        tag: 'label',
        category_id: params.id * 1,
      };
      await createNewCategory(data);
      fetchLabels();
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await getAllCategory();
      // console.log(res.data);
      const c = [];
      res.data.forEach((element) => {
        if (params.id * 1 === element.category_id && element.tag === 'label') {
          c.push(element);
        }
      });
      setLabels(c);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          setError(err.response.data.message);
        }
        if (err.response.data.message === 'labels not found') {
          setLabels([]);
        }
      }
    }
  };

  const delLabel = async (id) => {
    try {
      await deleteACategory(id);
      fetchLabels();
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div>
      <div className="max-w-7xl container mx-auto px-4 py-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold">Labels</h3>
          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            onClick={() => setIsOpen(true)}
          >
            Create Label
          </button>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 && !labels.length > 0 && (
          <div className="h-96 flex justify-center items-center">
            <div>
              <p className="mb-5 capitalize text-xl font-semibold">{error}</p>
              <button
                className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                onClick={() => setIsOpen(true)}
              >
                Create Label
              </button>
            </div>
          </div>
        )}
        {/* ------- All labels list ------------ */}
        {labels.length > 0 && (
          <div className="py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
            {labels.map((label) => {
              return (
                <div
                  key={label.id}
                  className="bg-blue-50 px-3 py-5 rounded-md border border-blue-300"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="capitalize text-xl font-semibold">
                      {label.name}
                    </h4>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delLabel(label.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                  <div className="my-2 border-b border-b-gray-600/50 opacity-30"></div>
                  <button
                    className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black"
                    onClick={() => navigate(`${label.id}`)}
                  >
                    upload Content
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------ Create New Class Pop up ------------------ */}
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
                    Create Class
                  </p>
                  <form
                    onSubmit={createLabel}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Chapter Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Chapter Name"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setInLabel(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Create Chapter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Label;
