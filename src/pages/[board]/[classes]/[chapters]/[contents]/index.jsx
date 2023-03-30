import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  deleteContent,
  getContentByChapter,
  uploadContentByChapter,
} from '../../../../../utils/api';
import { MdOutlineClose } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
const Contents = () => {
  const params = useParams();

  const [isExcercise, setIsExercise] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [isPractice, setIsPractice] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [contents, setContents] = useState({});
  const [error, setError] = useState('');
  const [excercise, setExercise] = useState(null);
  const [note, setNote] = useState(null);
  const [practice, setPractice] = useState(null);
  const [ytLink, setYtLink] = useState('');
  const [remark, setRemark] = useState('');

  const uploadExcercise = async (event) => {
    event.preventDefault();
    try {
      const content = new FormData();
      content.append('isExcercise', true);
      content.append('chapterid', params.id * 1);
      content.append('remark', remark);
      content.append('file', excercise);
      const res = await uploadContentByChapter(content);
      console.log(res);
      fetchContents();
      setIsExercise(false);
      setRemark('');
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  const uploadNotes = async (event) => {
    event.preventDefault();
    try {
      const content = new FormData();
      content.append('isnotes', true);
      content.append('chapterid', params.id * 1);
      content.append('remark', remark);
      content.append('file', note);
      const res = await uploadContentByChapter(content);
      console.log(res);
      fetchContents();
      setIsNotes(false);
      setRemark('');
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  const uploadPractice = async (event) => {
    event.preventDefault();
    try {
      const content = new FormData();
      content.append('ispractice', true);
      content.append('chapterid', params.id * 1);
      content.append('remark', remark);
      content.append('file', practice);
      const res = await uploadContentByChapter(content);
      console.log(res);
      fetchContents();
      setIsPractice(false);
      setRemark('');
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  const uploadYtVideo = async (event) => {
    event.preventDefault();
    try {
      const content = new FormData();
      content.append('isvideo', true);
      content.append('chapterid', params.id * 1);
      content.append('remark', remark);
      content.append('link', ytLink);
      const res = await uploadContentByChapter(content);
      console.log(res);
      fetchContents();
      setIsVideo(false);
      setRemark('');
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      }
    }
  };

  const fetchContents = async () => {
    try {
      const res = await getContentByChapter(params.id);
      console.log(res.data.contents);
      setContents(res.data.contents);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          setError(err.response.data.message);
        }
        if (err.response.data.message === 'contents not found') {
          setContents({});
        }
      }
    }
  };

  const delContent = async (id) => {
    try {
      await deleteContent(id);
      fetchContents();
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
    fetchContents();
  }, []);

  return (
    <div>
      <div className="max-w-7xl container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold">Contents</h3>
          <div className="flex gap-2">
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
              onClick={() => setIsExercise(true)}
            >
              Upload Excercise
            </button>
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
              onClick={() => setIsNotes(true)}
            >
              Upload Notes
            </button>
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
              onClick={() => setIsPractice(true)}
            >
              Upload Practices
            </button>
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
              onClick={() => setIsVideo(true)}
            >
              Upload Video
            </button>
          </div>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 &&
          !contents?.excercises?.length > 0 &&
          !contents?.notes?.length > 0 &&
          !contents?.practices?.length > 0 &&
          !contents?.videos?.length > 0 && (
            <div className="h-96 flex justify-center items-center">
              <div>
                <p className="mb-5 capitalize text-xl font-semibold">{error}</p>
              </div>
            </div>
          )}
        {/* -------- Exercises -------------- */}
        {contents?.excercises?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Excercise</h3>
            <div className="py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {contents?.excercises?.map((excercise) => {
                return (
                  <div key={excercise.id}>
                    <p>{excercise.remark}</p>
                    <div className="relative">
                      <img src={excercise.url} alt="excercise" />
                      <div className="absolute top-2 right-2">
                        <button
                          className="text-red-500 rounded-full bg-gray-300 p-2"
                          onClick={() => delContent(excercise.id)}
                        >
                          <BsTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* -------- Notes -------------- */}
        {contents?.notes?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Notes</h3>
            {contents?.notes?.map((note) => {
              return (
                <div
                  key={note.id}
                  className="mt-2 border-2 border-gray-400 px-2 py-5 flex justify-between items-center rounded-md shadow-sm"
                >
                  <p className="text-sm capitalize font-semibold">
                    {note.remark}
                  </p>
                  <div className="flex gap-2">
                    <a
                      onClick={() => window.open(note.url)}
                      className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                    >
                      download
                    </a>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delContent(note.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* -------- Practices -------------- */}
        {contents?.practices?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Practices</h3>
            {contents?.practices?.map((practice) => {
              return (
                <div
                  key={practice.id}
                  className="mt-2 border-2 border-gray-400 px-2 py-5 flex justify-between items-center rounded-md shadow-sm"
                >
                  <p className="text-sm capitalize font-semibold">
                    {practice.remark}
                  </p>
                  <div className="flex gap-2">
                    <a
                      onClick={() => window.open(practice.url)}
                      className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                    >
                      download
                    </a>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delContent(practice.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* -------- Yt Videos -------------- */}
        {contents?.videos?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Videos</h3>
            {contents?.videos?.map((video) => {
              return (
                <div
                  key={video.id}
                  className="mt-2 border-2 border-gray-400 px-2 py-5 rounded-md shadow-sm"
                >
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/pzzPowh241o"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  ></iframe>
                  <div>
                    <p className="text-sm capitalize font-semibold">
                      {video.remark}
                    </p>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delContent(video.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                  {/* <div className="flex gap-2">
                    <a
                      href={video.url}
                      target="_blank"
                      className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
                    >
                      Watch this Video
                    </a>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delContent(video.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
        {/* ---------- Upload Excercise -------- */}
        {isExcercise && (
          <div
            className={`${
              isExcercise
                ? 'transition-all duration-[6s] opacity-100 translate-y-0'
                : 'transition-all duration-[6s] opacity-0 translate-y-[200%]'
            } fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center`}
          >
            <div className="relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setIsExercise(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=" flex justify-center">
                <div className="px-3 py-8 w-full">
                  <p className="text-center text-xl text-blue-500 font-semibold">
                    Upload Excercise
                  </p>
                  <form
                    onSubmit={uploadExcercise}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Upload Excercise</label>
                      <input
                        required
                        type="file"
                        accept="image/*"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setExercise(e.target.files[0])}
                      />
                      <label className="text-sm">Remark</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Remark"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ---------- Upload Notes -------- */}
        {isNotes && (
          <div
            className={`${
              isNotes
                ? 'transition-all duration-[6s] opacity-100 translate-y-0'
                : 'transition-all duration-[6s] opacity-0 translate-y-[200%]'
            } fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center`}
          >
            <div className="relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setIsNotes(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=" flex justify-center">
                <div className="px-3 py-8 w-full">
                  <p className="text-center text-xl text-blue-500 font-semibold">
                    Upload Notes
                  </p>
                  <form
                    onSubmit={uploadNotes}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Upload Notes</label>
                      <input
                        required
                        type="file"
                        accept="application/pdf,application/vnd.ms-excel"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setNote(e.target.files[0])}
                      />
                      <label className="text-sm">Remark</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Remark"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ---------- Upload Practices -------- */}
        {isPractice && (
          <div
            className={`${
              isPractice
                ? 'transition-all duration-[6s] opacity-100 translate-y-0'
                : 'transition-all duration-[6s] opacity-0 translate-y-[200%]'
            } fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center`}
          >
            <div className="relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setIsPractice(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=" flex justify-center">
                <div className="px-3 py-8 w-full">
                  <p className="text-center text-xl text-blue-500 font-semibold">
                    Upload Practices
                  </p>
                  <form
                    onSubmit={uploadPractice}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Upload Practice</label>
                      <input
                        required
                        type="file"
                        accept="application/pdf,application/vnd.ms-excel"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setPractice(e.target.files[0])}
                      />
                      <label className="text-sm">Remark</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Remark"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ---------- Upload YT Video -------- */}
        {isVideo && (
          <div
            className={`${
              isVideo
                ? 'transition-all duration-[6s] opacity-100 translate-y-0'
                : 'transition-all duration-[6s] opacity-0 translate-y-[200%]'
            } fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center`}
          >
            <div className="relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border">
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setIsVideo(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=" flex justify-center">
                <div className="px-3 py-8 w-full">
                  <p className="text-center text-xl text-blue-500 font-semibold">
                    Upload Youtube Video
                  </p>
                  <form
                    onSubmit={uploadYtVideo}
                    className="py-10 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Youtube Video Link</label>
                      <input
                        required
                        type="text"
                        placeholder="Your Youtube Video Link"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setYtLink(e.target.value)}
                      />
                      <label className="text-sm">Remark</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Remark"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-1.5 text-white bg-blue-500 roundedd-sm"
                      >
                        Submit
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

export default Contents;
