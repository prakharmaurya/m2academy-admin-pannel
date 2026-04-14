import React, { useState, useEffect, useContext } from 'react'
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../utils/api'
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { MdOutlineClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { Context } from '../App'
import Loader from '../components/ui/Loader'
import EditForm from '../components/app/EditForm'

const Home = () => {
  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [boards, setBoards] = useState([])
  const [newBoardName, setNewBoardName] = useState('')
  const [error, setError] = useState('')

  // New state for managing the edit form
  const [editingBoard, setEditingBoard] = useState(null)
  const createBoard = async (event) => {
    event.preventDefault()
    if (newBoardName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({ type: 'error', msg: 'Board name cannot be empty!' })
      return
    }
    setLoading(true)
    try {
      await createNewCategory({ name: newBoardName, tag: 'board' })
      setIsCreateBoardOpen(false)
      setNewBoardName('')
      await fetchBoards()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Board created successfully' })
    } catch (err) {
      console.log(err)
      setIsCreateBoardOpen(false)
      if (err.response && err.response.data) {
        setIsShowSnack(true)
        setSnackDetail({ type: 'error', msg: err.response.data.message })
      }
    } finally {
      setLoading(false)
    }
  }

  const delBoard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this board?')) {
      return
    }
    setLoading(true)
    try {
      await deleteACategory(id)
      await fetchBoards()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Board deleted successfully' })
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        setIsShowSnack(true)
        setSnackDetail({ type: 'error', msg: err.response.data.message })
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchBoards = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const b = res.data.filter(
        (element) => element.category_id === 0 && element.tag === 'board',
      )
      setBoards(b)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'no boards found') {
          setBoards([])
          setError('No boards found. Create one!')
        } else {
          setIsShowSnack(true)
          setSnackDetail({ type: 'error', msg: err.response.data.message })
          setError('Failed to fetch boards.')
        }
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to open the EditForm modal
  const openEditForm = (board) => {
    setEditingBoard(board)
  }

  // Function to close the EditForm modal
  const closeEditForm = () => {
    setEditingBoard(null)
  }

  // Function to handle saving changes from EditForm
  const handleSaveEditBoard = async (id, newName) => {
    setLoading(true)
    try {
      await editACategory(id, { name: newName, tag: 'board' })
      closeEditForm()
      await fetchBoards()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Board updated successfully' })
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        setIsShowSnack(true)
        setSnackDetail({ type: 'error', msg: err.response.data.message })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Boards</h3>
          <div className='flex gap-1'>
            <button
              className='px-5 py-1.5 border border-blue-600 text-blue-600 rounded-sm'
              onClick={() => navigate('/slides')}
            >
              Slides
            </button>
            <button
              className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
              onClick={() => setIsCreateBoardOpen(true)}
            >
              Create Board
            </button>
          </div>
        </div>
        {/* ------- Error / No Boards Found ---------- */}
        {error.length > 0 &&
          boards.length === 0 && ( // Ensure error is shown only when no boards are present
            <div className='h-96 flex justify-center items-center'>
              <div>
                <p className='mb-5 capitalize text-xl font-semibold text-center'>
                  {error}
                </p>
                <button
                  className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                  onClick={() => setIsCreateBoardOpen(true)}
                >
                  Create Board
                </button>
              </div>
            </div>
          )}
        {/* ------- All Board list ------------ */}
        {boards.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {boards.map((board) => {
              return (
                <div
                  key={board.id}
                  className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
                >
                  <div className='flex justify-between items-center'>
                    <h4 className='uppercase text-xl font-semibold'>
                      {board.name}
                    </h4>
                    <div className='flex space-x-2'>
                      {/* Call openEditForm when edit button is clicked */}
                      <button
                        className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => openEditForm(board)}
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                        onClick={() => delBoard(board.id)}
                      >
                        <BsTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                  <button
                    className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                    onClick={() => navigate(`/${board.id}`)}
                  >
                    Classess
                  </button>
                </div>
              )
            })}
          </div>
        )}
        {/* ------------ Create Board Pop up ------------------ */}
        {isCreateBoardOpen && (
          <div
            className={`fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4`}
          >
            <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateBoardOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className=' flex justify-center'>
                <div className='px-3 py-8 w-full'>
                  <p className='text-center text-xl text-blue-500 font-semibold'>
                    Create Board
                  </p>
                  <form
                    onSubmit={createBoard}
                    className='py-10 flex flex-col gap-5'
                  >
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Board Name</label>
                      <input
                        required
                        type='text'
                        placeholder='Enter Your Board Name'
                        className='p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300'
                        onChange={(e) => setNewBoardName(e.target.value)}
                        value={newBoardName}
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button
                        type='submit'
                        className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
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

        {/* Conditionally render the EditForm when editingBoard is not null */}
        {editingBoard && (
          <EditForm
            board={editingBoard}
            onClose={closeEditForm}
            onSave={handleSaveEditBoard}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Home
