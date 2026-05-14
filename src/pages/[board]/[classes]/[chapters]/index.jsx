import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../../../utils/api'
import { MdOutlineClose, MdWarningAmber } from 'react-icons/md' // Warning icon add kiya
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { Context } from '../../../../App'
import Loader from '../../../../components/ui/Loader'
import EditForm from '../../../../components/app/EditForm'

const Chapters = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false)

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const [chapters, setChapters] = useState([])
  const [inputChapterName, setInputChapterName] = useState('')
  const [inputOrderNo, setInputOrderNo] = useState('')
  const [error, setError] = useState('')

  const [editingChapter, setEditingChapter] = useState(null)

  const createChapter = async (event) => {
    event.preventDefault()
    if (inputChapterName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({ type: 'error', msg: 'Chapter name cannot be empty!' })
      return
    }

    setLoading(true)
    try {
      const data = {
        name: inputChapterName,
        tag: 'chapter',
        category_id: params.id * 1,
        order_no: Number(inputOrderNo),
      }
      await createNewCategory(data)
      await fetchChapters()
      setIsCreateChapterOpen(false)
      setInputChapterName('')
      setInputOrderNo('')
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Chapter created successfully' })
    } catch (err) {
      console.log(err)
      setIsCreateChapterOpen(false)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // 1. Modal open karne ke liye function
  const openDeleteModal = (id) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  // 2. Actual delete handle karne ke liye function
  const handleConfirmDelete = async () => {
    if (!idToDelete) return

    setLoading(true)
    setIsDeleteModalOpen(false) // Close modal immediately
    try {
      await deleteACategory(idToDelete)
      await fetchChapters()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Chapter deleted successfully' })
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
      setIdToDelete(null)
    }
  }

  const fetchChapters = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data
        .filter(
          (element) =>
            params.id * 1 === element.category_id && element.tag === 'chapter',
        )
        .sort((a, b) => a.order_no - b.order_no)
      setChapters(c)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'chapters not found') {
          setChapters([])
          setError('No chapters found. Create one!')
        } else {
          setError('Failed to fetch chapters.')
          setSnackDetail({ type: 'error', msg: err.response.data.message })
          setIsShowSnack(true)
        }
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  const openEditChapterForm = (chap) => {
    setEditingChapter(chap)
  }

  const closeEditChapterForm = () => {
    setEditingChapter(null)
  }

  const handleSaveEditChapter = async (id, newName, newOrderNo) => {
    setLoading(true)
    try {
      await editACategory(id, {
        name: newName,
        tag: 'chapter',
        order_no: Number(newOrderNo),
      })
      closeEditChapterForm()
      await fetchChapters()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Chapter updated successfully' })
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [params.id])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Chapters</h3>
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateChapterOpen(true)}
          >
            Create Chapter
          </button>
        </div>

        {error.length > 0 && chapters.length === 0 && (
          <div className='h-96 flex justify-center items-center'>
            <div>
              <p className='mb-5 capitalize text-xl font-semibold text-center'>
                {error}
              </p>
              <button
                className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                onClick={() => setIsCreateChapterOpen(true)}
              >
                Create Chapter
              </button>
            </div>
          </div>
        )}

        {chapters.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {chapters.map((chap) => (
              <div
                key={chap.id}
                className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] text-blue-600 font-bold'>
                      Order: {chap.order_no}
                    </span>
                    <h4 className='capitalize text-xl font-semibold'>
                      {chap.name}
                    </h4>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openEditChapterForm(chap)}
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openDeleteModal(chap.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
                <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                <button
                  className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                  onClick={() => navigate(`${chap.id}`)}
                >
                  Create Label
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ------------ Create New Chapter Pop up ------------------ */}
        {isCreateChapterOpen && (
          <div className='fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateChapterOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className='px-3 py-8 w-full'>
                <p className='text-center text-xl text-blue-500 font-semibold'>
                  Create Chapter
                </p>
                <form
                  onSubmit={createChapter}
                  className='py-6 flex flex-col gap-5'
                >
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>Chapter Name</label>
                    <input
                      required
                      type='text'
                      placeholder='Enter Your Chapter Name'
                      className='p-3 rounded-sm bg-gray-200 focus:outline-blue-300 border-none'
                      onChange={(e) => setInputChapterName(e.target.value)}
                      value={inputChapterName}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>Order No</label>
                    <input
                      required
                      type='number'
                      placeholder='Enter Order No (e.g. 1)'
                      className='p-3 rounded-sm bg-gray-200 focus:outline-blue-300 border-none'
                      onChange={(e) => setInputOrderNo(e.target.value)}
                      value={inputOrderNo}
                    />
                  </div>
                  <div className='flex justify-center'>
                    <button
                      type='submit'
                      className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
                    >
                      Create Chapter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Delete Confirmation Pop up (NEW) ------------------ */}
        {isDeleteModalOpen && (
          <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border transition-all transform scale-100'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-red-100 p-3 rounded-full mb-4'>
                  <MdWarningAmber size={40} className='text-red-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>
                  Delete Chapter?
                </h3>
                <p className='text-gray-500 mt-2'>
                  Are you sure you want to delete this chapter? This action
                  cannot be undone.
                </p>

                <div className='flex gap-3 mt-8 w-full'>
                  <button
                    className='flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 font-medium'
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 font-medium transition-colors'
                    onClick={handleConfirmDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingChapter && (
          <EditForm
            board={editingChapter}
            onClose={closeEditChapterForm}
            onSave={handleSaveEditChapter}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Chapters
