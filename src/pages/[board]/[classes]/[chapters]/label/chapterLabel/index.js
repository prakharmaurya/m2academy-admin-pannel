import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../../../../../utils/api'
import { MdOutlineClose } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import Loader from '../../../../../../components/ui/Loader'
import { Context } from '../../../../../../App'
import EditForm from '../../../../../../components/app/EditForm'

const ChapterLabel = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateChapterLabelOpen, setIsCreateChapterLabelOpen] =
    useState(false)
  const [chapterLabels, setChapterLabels] = useState([])
  const [inputChapterLabelName, setInputChapterLabelName] = useState('')
  const [error, setError] = useState('')

  // New state for managing the edit form for chapter labels
  const [editingChapterLabel, setEditingChapterLabel] = useState(null)

  const createChapterLabel = async (event) => {
    event.preventDefault()
    if (inputChapterLabelName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({
        type: 'error',
        msg: 'Chapter Label name cannot be empty!',
      })
      return
    }

    setLoading(true)
    try {
      const data = {
        name: inputChapterLabelName,
        tag: 'chapter label',
        category_id: params.id * 1, // Ensure category_id is a number
      }
      await createNewCategory(data)
      await fetchChapterLabels()
      setIsCreateChapterLabelOpen(false)
      setInputChapterLabelName('')
      setIsShowSnack(true)
      setSnackDetail({
        type: 'success',
        msg: 'Chapter Label created successfully',
      })
    } catch (err) {
      console.log(err)
      setIsCreateChapterLabelOpen(false)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchChapterLabels = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data.filter(
        (element) =>
          params.id * 1 === element.category_id &&
          element.tag === 'chapter label',
      )
      setChapterLabels(c)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'Chapter labels not found') {
          setChapterLabels([])
          setError('No Chapter Labels found. Create one!')
        } else {
          setError('Failed to fetch Chapter Labels.')
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

  const delChapterLabel = async (id) => {
    if (
      !window.confirm('Are you sure you want to delete this Chapter Label?')
    ) {
      return
    }
    setLoading(true)
    try {
      await deleteACategory(id)
      await fetchChapterLabels()
      setIsShowSnack(true)
      setSnackDetail({
        type: 'success',
        msg: 'Chapter Label deleted successfully',
      })
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

  // Function to open the EditForm modal for a chapter label
  const openEditChapterLabelForm = (chapLabel) => {
    setEditingChapterLabel(chapLabel)
  }

  // Function to close the EditForm modal
  const closeEditChapterLabelForm = () => {
    setEditingChapterLabel(null)
  }

  // Function to handle saving changes from EditForm for chapter labels
  const handleSaveEditChapterLabel = async (id, newName) => {
    setLoading(true)
    try {
      // API call to update the chapter label name
      await editACategory(id, { name: newName, tag: 'chapter label' })
      closeEditChapterLabelForm()
      await fetchChapterLabels()
      setIsShowSnack(true)
      setSnackDetail({
        type: 'success',
        msg: 'Chapter Label updated successfully',
      })
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
    fetchChapterLabels()
  }, [params.id])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Chapter Labels</h3>{' '}
          {/* Corrected from singular */}
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateChapterLabelOpen(true)}
          >
            Create Chapter Label
          </button>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 && chapterLabels.length === 0 && (
          <div className='h-96 flex justify-center items-center'>
            <div>
              <p className='mb-5 capitalize text-xl font-semibold text-center'>
                {error}
              </p>
              <button
                className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                onClick={() => setIsCreateChapterLabelOpen(true)}
              >
                Create Chapter Label
              </button>
            </div>
          </div>
        )}
        {/* ------- All chapter labels list ------------ */}
        {chapterLabels.length > 0 && ( // Use new state variable
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {chapterLabels.map((chapLabel) => {
              // Use new state variable and param name
              return (
                <div
                  key={chapLabel.id}
                  className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
                >
                  <div className='flex justify-between items-center'>
                    <h4 className='capitalize text-xl font-semibold'>
                      {chapLabel.name}
                    </h4>
                    {/* Grouping buttons for consistent alignment and adding edit button */}
                    <div className='flex space-x-2'>
                      <button
                        className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => openEditChapterLabelForm(chapLabel)}
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => delChapterLabel(chapLabel.id)}
                      >
                        <BsTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                  <button
                    className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                    onClick={() => navigate(`${chapLabel.id}`)}
                  >
                    Upload Content
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* ------------ Create New Chapter Label Pop up ------------------ */}
        {isCreateChapterLabelOpen && (
          <div
            className={`fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4`}
          >
            <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateChapterLabelOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=' flex justify-center'>
                <div className='px-3 py-8 w-full'>
                  <p className='text-center text-xl text-blue-500 font-semibold'>
                    Create Chapter Label
                  </p>
                  <form
                    onSubmit={createChapterLabel}
                    className='py-10 flex flex-col gap-5'
                  >
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Chapter Label Name</label>{' '}
                      {/* Changed from singular "Chapter Label" */}
                      <input
                        required
                        type='text'
                        placeholder='Enter Chapter Label Name'
                        className='p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300'
                        onChange={(e) =>
                          setInputChapterLabelName(e.target.value)
                        }
                        value={inputChapterLabelName}
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button
                        disabled={loading} // Simplified disabled check
                        type='submit'
                        className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
                      >
                        {loading ? 'Creating...' : 'Create Chapter Label'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditionally render the EditForm when editingChapterLabel is not null */}
        {editingChapterLabel && (
          <EditForm
            board={editingChapterLabel} // EditForm expects 'board' prop, we pass 'editingChapterLabel'
            onClose={closeEditChapterLabelForm}
            onSave={handleSaveEditChapterLabel}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default ChapterLabel
