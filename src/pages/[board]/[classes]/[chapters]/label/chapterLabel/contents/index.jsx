import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  deleteContent,
  deleteExcercise,
  deleteYtVideo,
  getAllContents,
  uploadContents,
  uploadExcercises,
  uploadYtVideos,
  editExcercises,
} from '../../../../../../../utils/api';

import { Context } from '../../../../../../../App';

import { MdOutlineClose, MdModeEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import Loader from '../../../../../../../components/ui/Loader';

const Contents = () => {
  const params = useParams();

  const { setIsShowSnack, setSnackDetail } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [isExcercise, setIsExercise] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [isPractice, setIsPractice] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [contents, setContents] = useState({});
  const [error, setError] = useState('');
  // ----------- Excercise Section States -----------
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [exYtVideoLink, setExYtVideoLink] = useState('');

  const [currentExId, setCurrentExId] = useState('');
  //  Edit Question
  const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState(false);
  const [questionThumbnail, setQuestionThumbnail] = useState(null);
  const [prevQuestionImage, setPrevQuestionImage] = useState(null);
  //  Edit Solution
  const [isSolutionPopupOpen, setIsSolutionPopupOpen] = useState(false);
  const [solutionThumbnail, setSolutionThumbnail] = useState(null);
  const [prevSolutionImage, setPrevSolutionImage] = useState(null);
  // Edit Yt State
  const [showYtUrlInput, setShowYtUrlInput] = useState(false);
  const [ytEditLink, setYtEditLink] = useState('');
  // --------------------------------------------------
  const [note, setNote] = useState(null);
  const [practice, setPractice] = useState(null);
  const [ytLink, setYtLink] = useState('');
  const [remark, setRemark] = useState('');

  const uploadExcercise = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();

      content.append('categoryid', params.id * 1);
      content.append('remark', remark);
      content.append('questionfile', questionFile);
      if (answerFile) {
        content.append('answerfile', answerFile);
      }
      if (exYtVideoLink.length) {
        content.append('videourl', exYtVideoLink);
      }
      const res = await uploadExcercises(content);
      // console.log(res);
      fetchContents();
      setIsExercise(false);
      setAnswerFile(null);
      setQuestionFile(null);
      setRemark('');
      setExYtVideoLink('');
      setRemark('');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };

  const uploadNotes = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();
      content.append('tag', 'notes');
      content.append('categoryid', params.id * 1);
      content.append('remark', remark);
      content.append('file', note);
      const res = await uploadContents(content);
      // console.log(res);
      fetchContents();
      setIsNotes(false);
      setRemark('');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };

  const uploadPractice = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();
      content.append('tag', 'practice');
      content.append('categoryid', params.id * 1);
      content.append('remark', remark);
      content.append('file', practice);
      const res = await uploadContents(content);
      // console.log(res);
      fetchContents();
      setIsPractice(false);
      setRemark('');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };

  // --------------- Yt Video -----------------
  const uploadYoutubeVideo = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const d = { category_id: params.id * 1, url: ytLink };
      const res = await uploadYtVideos(d);
      // console.log(res);
      fetchContents();
      setIsVideo(false);
      setRemark('');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };

  const delYtVideo = async (id) => {
    setLoading(true);
    try {
      await deleteYtVideo(id);
      fetchContents();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };

  // -------------------------------------------------
  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await getAllContents(params.id * 1);
      // console.log(res);
      setContents(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setError(err.response.data.message);
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
        if (err.response.data.message === 'contents not found') {
          setContents({});
        }
      }
    }
    setLoading(false);
  };

  const delExContent = async (id) => {
    setLoading(true);
    try {
      await deleteExcercise(id);
      fetchContents();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };
  // ------------- Contents --------
  const delContent = async (id) => {
    setLoading(true);
    try {
      await deleteContent(id);
      fetchContents();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
    setLoading(false);
  };
  // ------------ Edit ----------------------
  const onQusetionImageChange = (event) => {
    setQuestionThumbnail(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      setPrevQuestionImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  const onSolutionImageChange = (event) => {
    setSolutionThumbnail(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      setPrevSolutionImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const editQuestion = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();
      content.append('questionfile', questionThumbnail);
      const { data } = await editExcercises(currentExId, content);
      console.log(data);
      fetchContents();
      setIsQuestionPopupOpen(false);
      setSnackDetail({ type: 'success', msg: data.message });
      setIsShowSnack(true);
      setLoading(false);
      setPrevQuestionImage(null);
      setQuestionThumbnail(null);
    } catch (err) {
      console.log(err);
      setPrevQuestionImage(null);
      setQuestionThumbnail(null);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
      setIsQuestionPopupOpen(false);
    }
  };
  const editSolution = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();
      content.append('answerfile', solutionThumbnail);
      const { data } = await editExcercises(currentExId, content);
      // console.log(data);
      fetchContents();
      setIsSolutionPopupOpen(false);
      setSnackDetail({ type: 'success', msg: data.message });
      setIsShowSnack(true);
      setLoading(false);
      setPrevSolutionImage(null);
      setSolutionThumbnail(null);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setPrevSolutionImage(null);
      setSolutionThumbnail(null);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
      setIsSolutionPopupOpen(false);
    }
  };

  const editYtLink = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const content = new FormData();
      content.append('videourl', ytEditLink);
      const { data } = await editExcercises(currentExId, content);
      // console.log(data);
      fetchContents();
      setShowYtUrlInput(false);
      setSnackDetail({ type: 'success', msg: data.message });
      setIsShowSnack(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
      setShowYtUrlInput(false);
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
                  <div key={excercise.id} className="border p-2">
                    <p className="pb-2 font-semibold">{excercise.remark}</p>
                    <div className="relative">
                      <img
                        className="h-60 w-full object-contain"
                        src={`https://storage.googleapis.com/ecoaching/${excercise.question_url}`}
                        alt="question"
                      />
                      <div className="absolute top-2 right-2 grid gap-2">
                        <button
                          className="text-red-500 rounded-full bg-gray-100 p-2 duration-150 hover:text-red-600 hover:bg-gray-200 hover:shadow-md"
                          onClick={() => delExContent(excercise.id)}
                        >
                          <BsTrash size={20} />
                        </button>

                        <button
                          className="text-gray-500 rounded-full bg-gray-100 p-2 duration-150 hover:text-gray-900 hover:bg-gray-200 hover:shadow-md"
                          onClick={() => {
                            setCurrentExId(excercise.id);
                            setIsQuestionPopupOpen(true);
                          }}
                        >
                          <MdModeEdit size={20} />
                        </button>
                      </div>
                      {isQuestionPopupOpen && (
                        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                          <form
                            onSubmit={editQuestion}
                            className="relative bg-white w-1/2 p-10 rounded shadow-md"
                          >
                            <div
                              onClick={() => {
                                setPrevQuestionImage(null);
                                setQuestionThumbnail(null);
                                setIsQuestionPopupOpen(false);
                              }}
                              className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200 hover:shadow-md duration-150 hover:cursor-pointer"
                            >
                              <MdOutlineClose size={30} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-sm md:text-sm">
                                Question
                              </label>
                              <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={onQusetionImageChange}
                                className="text-sm px-4 py-2 border border-black rounded-sm outline-black focus:border-none focus:outline focus:outline-blue-500"
                              />
                              {prevQuestionImage && (
                                <img
                                  alt="preview prevImage"
                                  src={prevQuestionImage}
                                  className="h-32 object-contain"
                                />
                              )}
                              <button
                                type="submit"
                                className="mt-2 bg-blue-500 text-white rounded-sm py-3 px-2"
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                    {excercise?.answer_url?.length ? (
                      <>
                        <p className="capitalize font-semibold mt-3 pb-2 border-t">
                          Solution
                        </p>
                        <button
                          onClick={() => {
                            setCurrentExId(excercise.id);
                            setIsSolutionPopupOpen(true);
                          }}
                          className="bg-blue-600 text-xs p-2 rounded-sm text-white"
                        >
                          edit solution
                        </button>
                        <img
                          className="h-60 w-60 object-contain"
                          src={`https://storage.googleapis.com/ecoaching/${excercise.answer_url}`}
                          alt="answer"
                        />
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentExId(excercise.id);
                          setIsSolutionPopupOpen(true);
                        }}
                        className="bg-blue-600 text-xs p-2 rounded-sm text-white"
                      >
                        upload solution
                      </button>
                    )}

                    {isSolutionPopupOpen && (
                      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                        <form
                          onSubmit={editSolution}
                          className="relative bg-white w-1/2 p-10 rounded shadow-md"
                        >
                          <div
                            onClick={() => {
                              setPrevSolutionImage(null);
                              setSolutionThumbnail(null);
                              setIsSolutionPopupOpen(false);
                            }}
                            className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200 hover:shadow-md duration-150 hover:cursor-pointer"
                          >
                            <MdOutlineClose size={30} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-sm md:text-sm">
                              Thumbnail
                            </label>
                            <input
                              required
                              type="file"
                              accept="image/*"
                              onChange={onSolutionImageChange}
                              className="text-sm px-4 py-2 border border-black rounded-sm outline-black focus:border-none focus:outline focus:outline-blue-500"
                            />
                            {prevSolutionImage && (
                              <img
                                alt="preview prevImage"
                                src={prevSolutionImage}
                                className="h-32 object-contain"
                              />
                            )}
                            <button
                              type="submit"
                              className="mt-2 bg-blue-500 text-white rounded-sm py-3 px-2"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {excercise?.video_url ? (
                      <>
                        <p className="capitalize font-semibold mt-3 pb-2 border-t">
                          Solution Video
                        </p>
                        <iframe
                          width="255"
                          height="158"
                          src={excercise.video_url}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                        <button
                          onClick={() => {
                            setCurrentExId(excercise.id);
                            setShowYtUrlInput(true);
                          }}
                          className="bg-blue-600 text-xs p-2 rounded-sm text-white"
                        >
                          edit video
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentExId(excercise.id);
                          setShowYtUrlInput(true);
                        }}
                        className="ml-2 mt-2 bg-blue-600 text-xs p-2 rounded-sm text-white"
                      >
                        upload video URL
                      </button>
                    )}
                    {showYtUrlInput && (
                      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                        <form
                          onSubmit={editYtLink}
                          className="relative bg-white w-1/2 p-10 rounded shadow-md"
                        >
                          <div
                            onClick={() => setShowYtUrlInput(false)}
                            className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200 hover:shadow-md duration-150 hover:cursor-pointer"
                          >
                            <MdOutlineClose size={30} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">
                              Youtube URL
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="Youtube link ex:https://www.youtube.com/embed/44y7eGwLaqs"
                              className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                              onChange={(el) => setYtEditLink(el.target.value)}
                            />
                            <button
                              type="submit"
                              className="mt-2 bg-blue-500 text-white rounded-sm py-3 px-2"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* -------- Notes -------------- */}
        {contents?.contents?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Notes</h3>
            {contents?.contents?.map((note) => {
              return (
                <>
                  {note.tag === 'notes' && (
                    <div
                      key={note.id}
                      className="mt-2 border-2 border-gray-400 px-2 py-5 flex justify-between items-center rounded-md shadow-sm"
                    >
                      <p className="text-sm capitalize font-semibold">
                        {note.remark}
                      </p>
                      <div className="flex gap-2">
                        <a
                          onClick={() => window.open(note.file_url)}
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
                  )}
                </>
              );
            })}
          </div>
        )}
        {/* -------- Practices -------------- */}
        {contents?.contents?.length > 0 && (
          <div className="py-5">
            <h3 className="text-2xl font-semibold">Practices</h3>
            {contents?.contents?.map((practice) => {
              return (
                <>
                  {practice.tag === 'practice' && (
                    <div
                      key={practice.id}
                      className="mt-2 border-2 border-gray-400 px-2 py-5 flex justify-between items-center rounded-md shadow-sm"
                    >
                      <p className="text-sm capitalize font-semibold">
                        {practice.remark}
                      </p>
                      <div className="flex gap-2">
                        <a
                          onClick={() => window.open(practice.file_url)}
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
                  )}
                </>
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
                    src={video.url}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  <div>
                    <p className="text-sm capitalize font-semibold">
                      {video.remark}
                    </p>
                    <button
                      className="text-red-500 hover:rounded-full hover:bg-gray-300 p-2"
                      onClick={() => delYtVideo(video.id)}
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
                      <label className="text-sm">Upload Question*</label>
                      <input
                        required
                        type="file"
                        accept="image/*"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setQuestionFile(e.target.files[0])}
                      />
                      <label className="text-sm">Upload Answer</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setAnswerFile(e.target.files[0])}
                      />
                      <label className="text-sm">Video URL</label>
                      <input
                        type="text"
                        placeholder="Enter Youtube Video URL"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setExYtVideoLink(e.target.value)}
                      />
                      <label className="text-sm">Remark*</label>
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
                    onSubmit={uploadYoutubeVideo}
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
                      {/* <label className="text-sm">Remark</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Your Remark"
                        className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                        onChange={(e) => setRemark(e.target.value)}
                      /> */}
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
      {loading && <Loader />}
    </div>
  );
};

export default Contents;
