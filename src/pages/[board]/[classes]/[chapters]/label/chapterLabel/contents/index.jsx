import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  deleteContent,
  deleteExcercise,
  deleteYtVideo,
  getAllContents,
  uploadContents,
  uploadExcercises,
  uploadYtVideos,
  editExcercises,
} from '../../../../../../../utils/api'

import { Context } from '../../../../../../../App'

import { MdOutlineClose, MdModeEdit, MdWarningAmber } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import Loader from '../../../../../../../components/ui/Loader'

const Contents = () => {
  const params = useParams()

  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isExcercise, setIsExercise] = useState(false)
  const [isNotes, setIsNotes] = useState(false)
  const [isPractice, setIsPractice] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [contents, setContents] = useState({})
  const [error, setError] = useState('')

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfig, setDeleteConfig] = useState({ id: null, type: '' })

  // ----------- Form States -----------
  const [questionFile, setQuestionFile] = useState(null)
  const [answerFile, setAnswerFile] = useState(null)
  const [exYtVideoLink, setExYtVideoLink] = useState('')
  const [inputOrderNo, setInputOrderNo] = useState('') // New State for Order No
  const [remark, setRemark] = useState('')
  const [note, setNote] = useState(null)
  const [practice, setPractice] = useState(null)
  const [ytLink, setYtLink] = useState('')

  // ----------- Edit States -----------
  const [currentExId, setCurrentExId] = useState('')
  const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState(false)
  const [questionThumbnail, setQuestionThumbnail] = useState(null)
  const [prevQuestionImage, setPrevQuestionImage] = useState(null)
  const [isSolutionPopupOpen, setIsSolutionPopupOpen] = useState(false)
  const [solutionThumbnail, setSolutionThumbnail] = useState(null)
  const [prevSolutionImage, setPrevSolutionImage] = useState(null)
  const [showYtUrlInput, setShowYtUrlInput] = useState(false)
  const [ytEditLink, setYtEditLink] = useState('')

  const fetchContents = async () => {
    setLoading(true)
    try {
      const res = await getAllContents(params.id * 1)
      setContents(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      if (err.response && err.response.data) {
        setError(err.response.data.message)
        if (err.response.data.message === 'contents not found') {
          setContents({})
        }
      }
    }
  }

  // Generic Delete Opener
  const openDeleteModal = (id, type) => {
    setDeleteConfig({ id, type })
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    const { id, type } = deleteConfig
    setLoading(true)
    setIsDeleteModalOpen(false)
    try {
      if (type === 'exercise') await deleteExcercise(id)
      else if (type === 'yt') await deleteYtVideo(id)
      else await deleteContent(id) // for notes/practice

      fetchContents()
      setSnackDetail({ type: 'success', msg: 'Deleted successfully' })
      setIsShowSnack(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadExcercise = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('categoryid', params.id * 1)
      content.append('remark', remark)
      content.append('order_no', Number(inputOrderNo)) // Added Order No
      content.append('questionfile', questionFile)
      if (answerFile) content.append('answerfile', answerFile)
      if (exYtVideoLink.length) content.append('videourl', exYtVideoLink)

      await uploadExcercises(content)
      fetchContents()
      setIsExercise(false)
      resetForm()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadNotes = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('tag', 'notes')
      content.append('categoryid', params.id * 1)
      content.append('remark', remark)
      content.append('order_no', Number(inputOrderNo)) // Added Order No
      content.append('file', note)
      await uploadContents(content)
      fetchContents()
      setIsNotes(false)
      resetForm()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadPractice = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('tag', 'practice')
      content.append('categoryid', params.id * 1)
      content.append('remark', remark)
      content.append('order_no', Number(inputOrderNo)) // Added Order No
      content.append('file', practice)
      await uploadContents(content)
      fetchContents()
      setIsPractice(false)
      resetForm()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadYoutubeVideo = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const d = {
        category_id: params.id * 1,
        url: ytLink,
        order_no: Number(inputOrderNo), // Added Order No
      }
      await uploadYtVideos(d)
      fetchContents()
      setIsVideo(false)
      resetForm()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRemark('')
    setInputOrderNo('')
    setQuestionFile(null)
    setAnswerFile(null)
    setExYtVideoLink('')
    setNote(null)
    setPractice(null)
    setYtLink('')
  }

  const handleError = (err) => {
    if (err.response && err.response.data) {
      setSnackDetail({ type: 'error', msg: err.response.data.message })
      setIsShowSnack(true)
    }
  }

  // (Keeping existing editQuestion, editSolution, editYtLink logic)
  const onQusetionImageChange = (e) => {
    setQuestionThumbnail(e.target.files[0])
    if (e.target.files[0])
      setPrevQuestionImage(URL.createObjectURL(e.target.files[0]))
  }
  const onSolutionImageChange = (e) => {
    setSolutionThumbnail(e.target.files[0])
    if (e.target.files[0])
      setPrevSolutionImage(URL.createObjectURL(e.target.files[0]))
  }

  const editQuestion = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('questionfile', questionThumbnail)
      await editExcercises(currentExId, content)
      fetchContents()
      setIsQuestionPopupOpen(false)
      setSnackDetail({ type: 'success', msg: 'Question updated' })
      setIsShowSnack(true)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
      setPrevQuestionImage(null)
    }
  }

  const editSolution = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('answerfile', solutionThumbnail)
      await editExcercises(currentExId, content)
      fetchContents()
      setIsSolutionPopupOpen(false)
      setSnackDetail({ type: 'success', msg: 'Solution updated' })
      setIsShowSnack(true)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
      setPrevSolutionImage(null)
    }
  }

  const editYtLink = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const content = new FormData()
      content.append('videourl', ytEditLink)
      await editExcercises(currentExId, content)
      fetchContents()
      setShowYtUrlInput(false)
      setSnackDetail({ type: 'success', msg: 'Video updated' })
      setIsShowSnack(true)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex flex-col md:flex-row md:justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Contents</h3>
          <div className='flex flex-wrap gap-2 mt-3 md:mt-0'>
            <button
              className='px-4 py-1.5 bg-blue-600 text-white rounded-sm'
              onClick={() => setIsExercise(true)}
            >
              Upload Excercise
            </button>
            <button
              className='px-4 py-1.5 bg-blue-600 text-white rounded-sm'
              onClick={() => setIsNotes(true)}
            >
              Upload Notes
            </button>
            <button
              className='px-4 py-1.5 bg-blue-600 text-white rounded-sm'
              onClick={() => setIsPractice(true)}
            >
              Upload Practices
            </button>
            <button
              className='px-4 py-1.5 bg-blue-600 text-white rounded-sm'
              onClick={() => setIsVideo(true)}
            >
              Upload Video
            </button>
          </div>
        </div>

        {/* -------- Exercises List -------------- */}
        {contents?.excercises?.length > 0 && (
          <div className='py-5'>
            <h3 className='text-2xl font-semibold mb-4'>Exercises</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
              {contents.excercises.map((ex) => (
                <div
                  key={ex.id}
                  className='border p-3 rounded shadow-sm bg-white relative'
                >
                  <span className='absolute top-2 left-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded'>
                    Order: {ex.order_no}
                  </span>
                  <p className='pt-5 pb-2 font-semibold text-center'>
                    {ex.remark}
                  </p>
                  <img
                    className='h-48 w-full object-contain border mb-2'
                    src={`https://storage.googleapis.com/ecoaching/${ex.question_url}`}
                    alt='Q'
                  />

                  <div className='flex justify-center gap-4 mb-3'>
                    <button
                      onClick={() => openDeleteModal(ex.id, 'exercise')}
                      className='text-red-500 p-2 bg-gray-100 rounded-full hover:bg-red-50'
                    >
                      <BsTrash size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentExId(ex.id)
                        setIsQuestionPopupOpen(true)
                      }}
                      className='text-blue-500 p-2 bg-gray-100 rounded-full hover:bg-blue-50'
                    >
                      <MdModeEdit size={18} />
                    </button>
                  </div>

                  {ex.answer_url ? (
                    <div className='border-t pt-2 mt-2'>
                      <button
                        onClick={() => {
                          setCurrentExId(ex.id)
                          setIsSolutionPopupOpen(true)
                        }}
                        className='text-[10px] bg-blue-600 text-white px-2 py-1 rounded'
                      >
                        Edit Solution
                      </button>
                      <img
                        className='h-32 w-full object-contain mt-1'
                        src={`https://storage.googleapis.com/ecoaching/${ex.answer_url}`}
                        alt='A'
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentExId(ex.id)
                        setIsSolutionPopupOpen(true)
                      }}
                      className='w-full mt-2 text-[10px] bg-green-600 text-white py-1 rounded'
                    >
                      Upload Solution
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------- Notes & Practices List (Combined view for brevity) -------------- */}
        {contents?.contents?.length > 0 && (
          <div className='py-5'>
            <h3 className='text-2xl font-semibold mb-4'>
              Documents (Notes & Practices)
            </h3>
            <div className='space-y-2'>
              {contents.contents.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-center p-4 border rounded bg-white'
                >
                  <div>
                    <span className='text-[10px] font-bold text-blue-600 uppercase mr-2'>
                      {item.tag}
                    </span>
                    <span className='bg-gray-200 px-2 py-0.5 text-[10px] rounded mr-2'>
                      Order: {item.order_no}
                    </span>
                    <p className='font-medium inline'>{item.remark}</p>
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => window.open(item.file_url)}
                      className='text-sm text-blue-600 font-bold hover:underline'
                    >
                      Download
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id, 'content')}
                      className='text-red-500'
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------- YT Videos List -------------- */}
        {contents?.videos?.length > 0 && (
          <div className='py-5'>
            <h3 className='text-2xl font-semibold mb-4'>Videos</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {contents.videos.map((v) => (
                <div key={v.id} className='border p-3 rounded bg-white'>
                  <iframe
                    className='w-full aspect-video'
                    src={v.url}
                    title='Video'
                    allowFullScreen
                  ></iframe>
                  <div className='mt-2 flex justify-between items-center'>
                    <p className='font-semibold text-sm'>Order: {v.order_no}</p>
                    <button
                      onClick={() => openDeleteModal(v.id, 'yt')}
                      className='text-red-500'
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Upload Exercise Popup -------- */}
        {isExcercise && (
          <div className='fixed z-30 bg-black/60 inset-0 flex justify-center items-center p-4 overflow-y-auto'>
            <div className='relative w-full max-w-md bg-white rounded p-6 shadow-lg'>
              <MdOutlineClose
                className='absolute top-3 right-3 cursor-pointer'
                size={25}
                onClick={() => setIsExercise(false)}
              />
              <h2 className='text-xl font-bold text-blue-600 text-center mb-6'>
                Upload Exercise
              </h2>
              <form onSubmit={uploadExcercise} className='space-y-4'>
                <div>
                  <label className='text-xs font-bold block mb-1'>
                    Upload Question*
                  </label>
                  <input
                    required
                    type='file'
                    accept='image/*'
                    className='w-full p-2 bg-gray-100 rounded border'
                    onChange={(e) => setQuestionFile(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className='text-xs font-bold block mb-1'>
                    Upload Answer (Optional)
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    className='w-full p-2 bg-gray-100 rounded border'
                    onChange={(e) => setAnswerFile(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className='text-xs font-bold block mb-1'>
                    Youtube Solution URL
                  </label>
                  <input
                    type='text'
                    placeholder='Embed link'
                    className='w-full p-2 bg-gray-100 rounded border'
                    onChange={(e) => setExYtVideoLink(e.target.value)}
                  />
                </div>
                <div className='flex gap-2'>
                  <div className='w-2/3'>
                    <label className='text-xs font-bold block mb-1'>
                      Remark*
                    </label>
                    <input
                      required
                      type='text'
                      placeholder='Topic name'
                      className='w-full p-2 bg-gray-100 rounded border'
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>
                  <div className='w-1/3'>
                    <label className='text-xs font-bold block mb-1'>
                      Order No*
                    </label>
                    <input
                      required
                      type='number'
                      className='w-full p-2 bg-gray-100 rounded border'
                      value={inputOrderNo}
                      onChange={(e) => setInputOrderNo(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 rounded font-bold mt-4'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------- Upload Notes Popup -------- */}
        {isNotes && (
          <div className='fixed z-30 bg-black/60 inset-0 flex justify-center items-center p-4'>
            <div className='relative w-full max-w-md bg-white rounded p-6 shadow-lg'>
              <MdOutlineClose
                className='absolute top-3 right-3 cursor-pointer'
                size={25}
                onClick={() => setIsNotes(false)}
              />
              <h2 className='text-xl font-bold text-blue-600 text-center mb-6'>
                Upload Notes
              </h2>
              <form onSubmit={uploadNotes} className='space-y-4'>
                <input
                  required
                  type='file'
                  accept='.pdf'
                  className='w-full p-2 bg-gray-100 border'
                  onChange={(e) => setNote(e.target.files[0])}
                />
                <input
                  required
                  type='text'
                  placeholder='Remark'
                  className='w-full p-2 bg-gray-100 border'
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <input
                  required
                  type='number'
                  placeholder='Order No'
                  className='w-full p-2 bg-gray-100 border'
                  value={inputOrderNo}
                  onChange={(e) => setInputOrderNo(e.target.value)}
                />
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 rounded font-bold'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------- Upload Practice Popup -------- */}
        {isPractice && (
          <div className='fixed z-30 bg-black/60 inset-0 flex justify-center items-center p-4'>
            <div className='relative w-full max-w-md bg-white rounded p-6 shadow-lg'>
              <MdOutlineClose
                className='absolute top-3 right-3 cursor-pointer'
                size={25}
                onClick={() => setIsPractice(false)}
              />
              <h2 className='text-xl font-bold text-blue-600 text-center mb-6'>
                Upload Practices
              </h2>
              <form onSubmit={uploadPractice} className='space-y-4'>
                <input
                  required
                  type='file'
                  accept='.pdf'
                  className='w-full p-2 bg-gray-100 border'
                  onChange={(e) => setPractice(e.target.files[0])}
                />
                <input
                  required
                  type='text'
                  placeholder='Remark'
                  className='w-full p-2 bg-gray-100 border'
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <input
                  required
                  type='number'
                  placeholder='Order No'
                  className='w-full p-2 bg-gray-100 border'
                  value={inputOrderNo}
                  onChange={(e) => setInputOrderNo(e.target.value)}
                />
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 rounded font-bold'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------- Upload YT Video Popup -------- */}
        {isVideo && (
          <div className='fixed z-30 bg-black/60 inset-0 flex justify-center items-center p-4'>
            <div className='relative w-full max-w-md bg-white rounded p-6 shadow-lg'>
              <MdOutlineClose
                className='absolute top-3 right-3 cursor-pointer'
                size={25}
                onClick={() => setIsVideo(false)}
              />
              <h2 className='text-xl font-bold text-blue-600 text-center mb-6'>
                Upload YT Video
              </h2>
              <form onSubmit={uploadYoutubeVideo} className='space-y-4'>
                <input
                  required
                  type='text'
                  placeholder='Video Embed Link'
                  className='w-full p-2 bg-gray-100 border'
                  onChange={(e) => setYtLink(e.target.value)}
                />
                <input
                  required
                  type='number'
                  placeholder='Order No'
                  className='w-full p-2 bg-gray-100 border'
                  value={inputOrderNo}
                  onChange={(e) => setInputOrderNo(e.target.value)}
                />
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 rounded font-bold'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ------------ Delete Confirmation Modal ------------------ */}
        {isDeleteModalOpen && (
          <div className='fixed z-50 bg-black/60 inset-0 flex justify-center items-center p-4'>
            <div className='bg-white w-full max-w-sm rounded-md p-6 flex flex-col items-center text-center'>
              <MdWarningAmber size={50} className='text-red-500 mb-4' />
              <h3 className='text-lg font-bold'>Delete Item?</h3>
              <p className='text-gray-500 mt-2 text-sm'>
                This will remove the content permanently. Continue?
              </p>
              <div className='flex gap-3 mt-6 w-full'>
                <button
                  className='flex-1 py-2 bg-gray-200 rounded'
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className='flex-1 py-2 bg-red-600 text-white rounded font-bold'
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* (Keeping existing Question/Solution Edit Popups) */}
        {isQuestionPopupOpen && (
          <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
            <form
              onSubmit={editQuestion}
              className='relative bg-white w-11/12 md:w-1/2 p-6 rounded'
            >
              <MdOutlineClose
                onClick={() => setIsQuestionPopupOpen(false)}
                className='absolute right-2 top-2 cursor-pointer'
                size={25}
              />
              <label className='text-sm font-bold'>Edit Question Image</label>
              <input
                required
                type='file'
                accept='image/*'
                onChange={onQusetionImageChange}
                className='w-full border p-2 mt-2'
              />
              {prevQuestionImage && (
                <img
                  src={prevQuestionImage}
                  className='h-32 object-contain mt-2 mx-auto'
                />
              )}
              <button
                type='submit'
                className='w-full bg-blue-500 text-white mt-4 py-2 rounded'
              >
                Update
              </button>
            </form>
          </div>
        )}

        {isSolutionPopupOpen && (
          <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
            <form
              onSubmit={editSolution}
              className='relative bg-white w-11/12 md:w-1/2 p-6 rounded'
            >
              <MdOutlineClose
                onClick={() => setIsSolutionPopupOpen(false)}
                className='absolute right-2 top-2 cursor-pointer'
                size={25}
              />
              <label className='text-sm font-bold'>Edit Solution Image</label>
              <input
                required
                type='file'
                accept='image/*'
                onChange={onSolutionImageChange}
                className='w-full border p-2 mt-2'
              />
              {prevSolutionImage && (
                <img
                  src={prevSolutionImage}
                  className='h-32 object-contain mt-2 mx-auto'
                />
              )}
              <button
                type='submit'
                className='w-full bg-blue-500 text-white mt-4 py-2 rounded'
              >
                Update
              </button>
            </form>
          </div>
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Contents
