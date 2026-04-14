import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdOutlineClose } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'

import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../utils/api'
import { Context } from '../../App'
import Loader from '../../components/ui/Loader'
import EditForm from '../../components/app/EditForm'

const Board = () => {
  // This component is named Board but displays Classes
  const params = useParams()
  const navigate = useNavigate()

  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
  const [classess, setClassess] = useState([])
  const [inputClassName, setInputClassName] = useState('')
  const [error, setError] = useState('')

  // New state for managing the edit form for classes
  const [editingClass, setEditingClass] = useState(null)

  const createClass = async (event) => {
    event.preventDefault()
    if (inputClassName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({ type: 'error', msg: 'Class name cannot be empty!' })
      return
    }

    setLoading(true)
    const data = {
      name: inputClassName,
      tag: 'class',
      category_id: params.id * 1, // Ensure category_id is a number
    }
    try {
      await createNewCategory(data)
      await fetchClassess()
      setIsCreateClassOpen(false)
      setInputClassName('')
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Class created successfully' })
    } catch (err) {
      console.log(err)
      setIsCreateClassOpen(false)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const delClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return
    }
    setLoading(true)
    try {
      await deleteACategory(id)
      await fetchClassess()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Class deleted successfully' })
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

  const fetchClassess = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data.filter(
        (element) =>
          params.id * 1 === element.category_id && element.tag === 'class',
      )
      setClassess(c)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'classes not found') {
          setClassess([])
          setError('No classes found. Create one!')
        } else {
          setError('Failed to fetch classes.')
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

  // Function to open the EditForm modal for a class
  const openEditClassForm = (cls) => {
    setEditingClass(cls)
  }

  // Function to close the EditForm modal
  const closeEditClassForm = () => {
    setEditingClass(null)
  }

  // Function to handle saving changes from EditForm for classes
  const handleSaveEditClass = async (id, newName) => {
    setLoading(true)
    try {
      // API call to update the class name
      await editACategory(id, { name: newName, tag: 'class' })
      closeEditClassForm()
      await fetchClassess()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Class updated successfully' })
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
    fetchClassess()
  }, [params.id]) // Dependency array includes params.id so it refetches if the board changes

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Classes</h3>{' '}
          {/* Corrected "Classess" to "Classes" */}
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateClassOpen(true)}
          >
            Create Class
          </button>
        </div>
        {/* ------- Error ---------- */}
        {error.length > 0 && classess.length === 0 && (
          <div className='h-96 flex justify-center items-center'>
            <div>
              <p className='mb-5 capitalize text-xl font-semibold text-center'>
                {error}
              </p>
              <button
                className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                onClick={() => setIsCreateClassOpen(true)}
              >
                Create Class
              </button>
            </div>
          </div>
        )}
        {/* ------- All Classess list ------------ */}
        {classess.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {classess.map((cls) => {
              return (
                <div
                  key={cls.id}
                  className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
                >
                  <div className='flex justify-between items-center'>
                    <h4 className='capitalize text-xl font-semibold'>
                      {cls.name}
                    </h4>
                    {/* Grouping buttons for consistent alignment and adding edit button */}
                    <div className='flex space-x-2'>
                      <button
                        className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => openEditClassForm(cls)}
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => delClass(cls.id)}
                      >
                        <BsTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                  <button
                    className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                    onClick={() => navigate(`${cls.id}`)}
                  >
                    Subjects
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* ------------ Create New Class Pop up ------------------ */}
        {isCreateClassOpen && (
          <div
            className={`fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4`}
          >
            <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateClassOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=' flex justify-center'>
                <div className='px-3 py-8 w-full'>
                  <p className='text-center text-xl text-blue-500 font-semibold'>
                    Create Class
                  </p>
                  <form
                    onSubmit={createClass}
                    className='py-10 flex flex-col gap-5'
                  >
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Class Name</label>
                      <input
                        required
                        type='text'
                        placeholder='Enter Your Class Name'
                        className='p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300'
                        onChange={(e) => setInputClassName(e.target.value)}
                        value={inputClassName}
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button
                        type='submit'
                        className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
                      >
                        Create Class
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditionally render the EditForm when editingClass is not null */}
        {editingClass && (
          <EditForm
            board={editingClass} // EditForm expects 'board' prop, we pass 'editingClass'
            onClose={closeEditClassForm}
            onSave={handleSaveEditClass}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Board
