import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineClose } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';

import {
  createSubjectByClass,
  deleteSubject,
  getSubjectsByClass,
} from '../../../utils/api';

const Classes = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [inSub, setInSub] = useState('');
  const [error, setError] = useState('');

  const createSubject = async (event) => {
    event.preventDefault();
    const data = {
      name: inSub,
      class_id: params.id * 1,
    };
    try {
      const res = await createSubjectByClass(data);
      console.log(res);
      fetchAllSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  const delSubject = async (id) => {
    try {
      await deleteSubject(id);
      fetchAllSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const id = params.id * 1;
      const res = await getSubjectsByClass(id);
      console.log(res);
      setAllSubjects(res.data.subjects);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          setError(err.response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  return (
    <div>
      <div className="max-w-7xl container mx-auto px-4 py-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold">Subjects</h3>
          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            onClick={() => setIsOpen(true)}
          >
            Create Subject
          </button>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 && (
          <div className="h-96 flex justify-center items-center">
            <div>
              <p className="mb-5 capitalize text-xl font-semibold">{error}</p>
              <button
                className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                onClick={() => setIsOpen(true)}
              >
                Create Class
              </button>
            </div>
          </div>
        )}
        {/* ------- All allSubjects list ------------ */}
        {allSubjects.length > 0 && (
          <div className="py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
            {allSubjects.map((sub) => {
              return (
                <div
                  key={sub.id}
                  className="bg-blue-50 px-3 py-5 rounded-md border border-blue-300"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="capitalize text-xl font-semibold">
                      {sub.name}
                    </h4>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delSubject(sub.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                  <div className="my-2 border-b border-b-gray-600/50 opacity-30"></div>
                  <button
                    className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black"
                    onClick={() => navigate(`${sub.id}`)}
                  >
                    Chapters
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
                    onSubmit={createSubject}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Subject Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Subject Name"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setInSub(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Create Subject
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

export default Classes;
