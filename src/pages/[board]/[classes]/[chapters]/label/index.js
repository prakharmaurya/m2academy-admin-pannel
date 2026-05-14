import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../../../../utils/api'
import { MdOutlineClose, MdWarningAmber } from 'react-icons/md' // Warning icon add kiya
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import Loader from '../../../../../components/ui/Loader'
import { Context } from '../../../../../App'
import EditForm from '../../../../../components/app/EditForm'

const Label = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateLabelOpen, setIsCreateLabelOpen] = useState(false)

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const [labels, setLabels] = useState([])
  const [inputLabelName, setInputLabelName] = useState('')
  const [inputOrderNo, setInputOrderNo] = useState('')
  const [error, setError] = useState('')

  const [editingLabel, setEditingLabel] = useState(null)

  const createLabel = async (event) => {
    event.preventDefault()
    if (inputLabelName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({ type: 'error', msg: 'Label name cannot be empty!' })
      return
    }

    setLoading(true)
    try {
      const data = {
        name: inputLabelName,
        tag: 'label',
        category_id: params.id * 1,
        order_no: Number(inputOrderNo),
      }
      await createNewCategory(data)
      await fetchLabels()
      setIsCreateLabelOpen(false)
      setInputLabelName('')
      setInputOrderNo('')
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Label created successfully' })
    } catch (err) {
      console.log(err)
      setIsCreateLabelOpen(false)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete Modal logic
  const openDeleteModal = (id) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!idToDelete) return
    setLoading(true)
    setIsDeleteModalOpen(false)
    try {
      await deleteACategory(idToDelete)
      await fetchLabels()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Label deleted successfully' })
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

  const fetchLabels = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data
        .filter(
          (element) =>
            params.id * 1 === element.category_id && element.tag === 'label',
        )
        .sort((a, b) => a.order_no - b.order_no)
      setLabels(c)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'labels not found') {
          setLabels([])
          setError('No labels found. Create one!')
        } else {
          setError('Failed to fetch labels.')
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

  const openEditLabelForm = (label) => {
    setEditingLabel(label)
  }

  const closeEditLabelForm = () => {
    setEditingLabel(null)
  }

  const handleSaveEditLabel = async (id, newName, newOrderNo) => {
    setLoading(true)
    try {
      await editACategory(id, {
        name: newName,
        tag: 'label',
        order_no: Number(newOrderNo),
      })
      closeEditLabelForm()
      await fetchLabels()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Label updated successfully' })
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
    fetchLabels()
  }, [params.id])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Labels</h3>
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateLabelOpen(true)}
          >
            Create Label
          </button>
        </div>

        {error.length > 0 && labels.length === 0 && (
          <div className='h-96 flex justify-center items-center'>
            <div>
              <p className='mb-5 capitalize text-xl font-semibold text-center'>
                {error}
              </p>
              <button
                className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                onClick={() => setIsCreateLabelOpen(true)}
              >
                Create Label
              </button>
            </div>
          </div>
        )}

        {labels.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {labels.map((label) => (
              <div
                key={label.id}
                className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <h4 className='capitalize text-xl font-semibold'>
                      {label.name}
                    </h4>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openEditLabelForm(label)}
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openDeleteModal(label.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
                <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                <button
                  className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                  onClick={() => navigate(`${label.id}`)}
                >
                  Create Chapter Label
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ------------ Create New Label Pop up ------------------ */}
        {isCreateLabelOpen && (
          <div className='fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateLabelOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className='flex justify-center'>
                <div className='px-3 py-8 w-full'>
                  <p className='text-center text-xl text-blue-500 font-semibold'>
                    Create Label
                  </p>
                  <form
                    onSubmit={createLabel}
                    className='py-10 flex flex-col gap-5'
                  >
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Label Name</label>
                      <input
                        required
                        type='text'
                        placeholder='Enter Your Label Name'
                        className='p-3 rounded-sm bg-gray-200 focus:outline focus:outline-blue-300 border-none'
                        onChange={(e) => setInputLabelName(e.target.value)}
                        value={inputLabelName}
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm'>Order No</label>
                      <input
                        required
                        type='number'
                        placeholder='Enter Order No'
                        className='p-3 rounded-sm bg-gray-200 focus:outline focus:outline-blue-300 border-none'
                        onChange={(e) => setInputOrderNo(e.target.value)}
                        value={inputOrderNo}
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button
                        type='submit'
                        className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
                      >
                        Create Label
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Delete Confirmation Pop up (NEW) ------------------ */}
        {isDeleteModalOpen && (
          <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-red-100 p-3 rounded-full mb-4'>
                  <MdWarningAmber size={40} className='text-red-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>
                  Delete Label?
                </h3>
                <p className='text-gray-500 mt-2'>
                  Are you sure you want to delete this label? This action cannot
                  be undone.
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

        {editingLabel && (
          <EditForm
            board={editingLabel}
            onClose={closeEditLabelForm}
            onSave={handleSaveEditLabel}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Label
