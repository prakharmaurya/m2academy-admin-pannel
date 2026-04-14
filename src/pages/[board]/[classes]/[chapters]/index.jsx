import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../../../utils/api'
import { MdOutlineClose } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { Context } from '../../../../App'
import Loader from '../../../../components/ui/Loader'
import EditForm from '../../../../components/app/EditForm'

const Chapters = () => {
  const params = useParams() // params.id will be the category_id for chapters
  const navigate = useNavigate()
  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false)
  const [chapters, setChapters] = useState([])
  const [inputChapterName, setInputChapterName] = useState('')
  const [error, setError] = useState('')

  // New state for managing the edit form for chapters
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
        category_id: params.id * 1, // Ensure category_id is a number
      }
      await createNewCategory(data)
      await fetchChapters()
      setIsCreateChapterOpen(false)
      setInputChapterName('')
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

  const fetchChapters = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data.filter(
        (element) =>
          params.id * 1 === element.category_id && element.tag === 'chapter',
      )
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

  const delChapter = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return
    }
    setLoading(true)
    try {
      await deleteACategory(id)
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
    }
  }

  // Function to open the EditForm modal for a chapter
  const openEditChapterForm = (chap) => {
    setEditingChapter(chap)
  }

  // Function to close the EditForm modal
  const closeEditChapterForm = () => {
    setEditingChapter(null)
  }

  // Function to handle saving changes from EditForm for chapters
  const handleSaveEditChapter = async (id, newName) => {
    setLoading(true)
    try {
      // API call to update the chapter name
      await editACategory(id, { name: newName, tag: 'chapter' })
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
        {/* ------- Error ---------- */}
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
        {/* ------- All chapters list ------------ */}
        {chapters.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {chapters.map((chap) => {
              return (
                <div
                  key={chap.id}
                  className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
                >
                  <div className='flex justify-between items-center'>
                    <h4 className='capitalize text-xl font-semibold'>
                      {chap.name}
                    </h4>
                    {/* Grouping buttons for consistent alignment and adding edit button */}
                    <div className='flex space-x-2'>
                      <button
                        className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => openEditChapterForm(chap)}
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => delChapter(chap.id)}
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
              )
            })}
          </div>
        )}

        {/* ------------ Create New Chapter Pop up ------------------ */}
        {isCreateChapterOpen && (
          <div
            className={`fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4`}
          >
            <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateChapterOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=' flex justify-center'>
                <div className='px-3 py-8 w-full'>
                  <p className='text-center text-xl text-blue-500 font-semibold'>
                    Create Chapter
                  </p>{' '}
                  {/* Changed from "Create Class" */}
                  <form
                    onSubmit={createChapter}
                    className='py-10 flex flex-col gap-5'
                  >
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Chapter Name</label>
                      <input
                        required
                        type='text'
                        placeholder='Enter Your Chapter Name'
                        className='p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300'
                        onChange={(e) => setInputChapterName(e.target.value)}
                        value={inputChapterName}
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
          </div>
        )}

        {/* Conditionally render the EditForm when editingChapter is not null */}
        {editingChapter && (
          <EditForm
            board={editingChapter} // EditForm expects 'board' prop, we pass 'editingChapter'
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
