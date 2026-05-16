// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { MdOutlineClose, MdWarningAmber } from 'react-icons/md' // Warning icon add kiya
// import { BsTrash } from 'react-icons/bs'
// import { FaRegEdit } from 'react-icons/fa'

// import {
//   createNewCategory,
//   deleteACategory,
//   getAllCategory,
//   editACategory,
// } from '../../../utils/api'
// import Loader from '../../../components/ui/Loader'
// import { Context } from '../../../App'
// import EditForm from '../../../components/app/EditForm'

// const Classes = () => {
//   const params = useParams()
//   const navigate = useNavigate()
//   const { setIsShowSnack, setSnackDetail } = useContext(Context)
//   const [loading, setLoading] = useState(false)
//   const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false)

//   // Delete Modal States
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [idToDelete, setIdToDelete] = useState(null)

//   const [allSubjects, setAllSubjects] = useState([])
//   const [inputSubjectName, setInputSubjectName] = useState('')
//   const [inputOrderNo, setInputOrderNo] = useState('')
//   const [error, setError] = useState('')

//   const [editingSubject, setEditingSubject] = useState(null)

//   const createSubject = async (event) => {
//     event.preventDefault()
//     if (inputSubjectName.trim() === '') {
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'error', msg: 'Subject name cannot be empty!' })
//       return
//     }

//     setLoading(true)
//     const data = {
//       name: inputSubjectName,
//       tag: 'subject',
//       category_id: params.id * 1,
//       order_no: Number(inputOrderNo),
//     }
//     try {
//       await createNewCategory(data)
//       await fetchAllSubjects()
//       setIsCreateSubjectOpen(false)
//       setInputSubjectName('')
//       setInputOrderNo('')
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Subject created successfully' })
//     } catch (err) {
//       console.log(err)
//       setIsCreateSubjectOpen(false)
//       if (err.response && err.response.data) {
//         setSnackDetail({ type: 'error', msg: err.response.data.message })
//         setIsShowSnack(true)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 1. Delete Confirm Modal Open karne ka function
//   const openDeleteModal = (id) => {
//     setIdToDelete(id)
//     setIsDeleteModalOpen(true)
//   }

//   // 2. Actual Delete API call function
//   const handleConfirmDelete = async () => {
//     if (!idToDelete) return

//     setLoading(true)
//     setIsDeleteModalOpen(false) // Modal turant close karein
//     try {
//       await deleteACategory(idToDelete)
//       await fetchAllSubjects()
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Subject deleted successfully' })
//     } catch (err) {
//       console.log(err)
//       if (err.response && err.response.data) {
//         setSnackDetail({ type: 'error', msg: err.response.data.message })
//         setIsShowSnack(true)
//       }
//     } finally {
//       setLoading(false)
//       setIdToDelete(null)
//     }
//   }

//   const fetchAllSubjects = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await getAllCategory()
//       const s = res.data.filter(
//         (element) =>
//           params.id * 1 === element.category_id && element.tag === 'subject',
//       )
//       setAllSubjects(s)
//     } catch (err) {
//       console.log(err)
//       if (err.response && err.response.data) {
//         if (err.response.data.message === 'subjects not found') {
//           setAllSubjects([])
//           setError('No subjects found. Create one!')
//         } else {
//           setError('Failed to fetch subjects.')
//           setSnackDetail({ type: 'error', msg: err.response.data.message })
//           setIsShowSnack(true)
//         }
//       } else {
//         setError('An unexpected error occurred.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const openEditSubjectForm = (subject) => {
//     setEditingSubject(subject)
//   }

//   const closeEditSubjectForm = () => {
//     setEditingSubject(null)
//   }

//   const handleSaveEditSubject = async (id, newName) => {
//     setLoading(true)
//     try {
//       await editACategory(id, { name: newName, tag: 'subject' })
//       closeEditSubjectForm()
//       await fetchAllSubjects()
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Subject updated successfully' })
//     } catch (err) {
//       console.log(err)
//       if (err.response && err.response.data) {
//         setSnackDetail({ type: 'error', msg: err.response.data.message })
//         setIsShowSnack(true)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAllSubjects()
//   }, [])

//   return (
//     <div>
//       <div className='max-w-7xl container mx-auto px-4 py-5'>
//         <div className='flex justify-between items-center mb-5'>
//           <h3 className='text-2xl font-semibold'>Subjects</h3>
//           <button
//             className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
//             onClick={() => setIsCreateSubjectOpen(true)}
//           >
//             Create Subject
//           </button>
//         </div>

//         {error.length > 0 && allSubjects.length === 0 && (
//           <div className='h-96 flex justify-center items-center'>
//             <div>
//               <p className='mb-5 capitalize text-xl font-semibold text-center'>
//                 {error}
//               </p>
//               <button
//                 className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
//                 onClick={() => setIsCreateSubjectOpen(true)}
//               >
//                 Create Subject
//               </button>
//             </div>
//           </div>
//         )}

//         {allSubjects.length > 0 && (
//           <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
//             {allSubjects.map((sub) => (
//               <div
//                 key={sub.id}
//                 className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
//               >
//                 <div className='flex justify-between items-center'>
//                   <h4 className='capitalize text-xl font-semibold'>
//                     {sub.name}
//                   </h4>
//                   <div className='flex space-x-2'>
//                     <button
//                       className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
//                       onClick={() => openEditSubjectForm(sub)}
//                     >
//                       <FaRegEdit size={20} />
//                     </button>
//                     <button
//                       className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
//                       onClick={() => openDeleteModal(sub.id)} // Browser confirm ki jagah modal open hoga
//                     >
//                       <BsTrash size={20} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
//                 <button
//                   className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
//                   onClick={() => navigate(`${sub.id}`)}
//                 >
//                   Chapters
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ------------ Create New Subject Pop up ------------------ */}
//         {isCreateSubjectOpen && (
//           <div className='fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
//             <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
//               <div
//                 className='absolute top-2 right-2 cursor-pointer'
//                 onClick={() => setIsCreateSubjectOpen(false)}
//               >
//                 <MdOutlineClose size={25} />
//               </div>
//               <div className='px-3 py-8 w-full'>
//                 <p className='text-center text-xl text-blue-500 font-semibold'>
//                   Create Subject
//                 </p>
//                 <form
//                   onSubmit={createSubject}
//                   className='py-10 flex flex-col gap-5'
//                 >
//                   <div className='flex flex-col gap-1'>
//                     <label className='text-sm'>Subject Name</label>
//                     <input
//                       required
//                       type='text'
//                       placeholder='Enter Your Subject Name'
//                       className='p-3 rounded-sm bg-gray-200 border-none focus:outline focus:outline-blue-300'
//                       onChange={(e) => setInputSubjectName(e.target.value)}
//                       value={inputSubjectName}
//                     />
//                   </div>
//                   <div className='flex flex-col gap-1'>
//                     <label className='text-sm'>Order No</label>
//                     <input
//                       required
//                       type='number'
//                       placeholder='Enter Order Number (e.g. 1)'
//                       className='p-3 rounded-sm bg-gray-200 border-none focus:outline focus:outline-blue-300'
//                       onChange={(e) => setInputOrderNo(e.target.value)}
//                       value={inputOrderNo}
//                     />
//                   </div>
//                   <div className='flex justify-center'>
//                     <button
//                       type='submit'
//                       className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
//                     >
//                       Create Subject
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ------------ Delete Confirmation Pop up (NEW) ------------------ */}
//         {isDeleteModalOpen && (
//           <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
//             <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border transition-all transform scale-100'>
//               <div className='flex flex-col items-center text-center'>
//                 <div className='bg-red-100 p-3 rounded-full mb-4'>
//                   <MdWarningAmber size={40} className='text-red-600' />
//                 </div>
//                 <h3 className='text-xl font-bold text-gray-800'>
//                   Delete Subject?
//                 </h3>
//                 <p className='text-gray-500 mt-2'>
//                   Are you sure you want to delete this subject? This action
//                   cannot be undone.
//                 </p>

//                 <div className='flex gap-3 mt-8 w-full'>
//                   <button
//                     className='flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 font-medium'
//                     onClick={() => setIsDeleteModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className='flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 font-medium transition-colors'
//                     onClick={handleConfirmDelete}
//                   >
//                     Yes, Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {editingSubject && (
//           <EditForm
//             board={editingSubject}
//             onClose={closeEditSubjectForm}
//             onSave={handleSaveEditSubject}
//           />
//         )}
//       </div>
//       {loading && <Loader />}
//     </div>
//   )
// }

// export default Classes
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdOutlineClose, MdWarningAmber } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'

import {
  createNewCategory,
  deleteACategory,
  getAllCategory,
  editACategory,
} from '../../../utils/api'
import Loader from '../../../components/ui/Loader'
import { Context } from '../../../App'
import EditForm from '../../../components/app/EditForm'

const Classes = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false)

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const [allSubjects, setAllSubjects] = useState([])
  const [inputSubjectName, setInputSubjectName] = useState('')
  const [inputOrderNo, setInputOrderNo] = useState('')
  const [error, setError] = useState('')

  const [editingSubject, setEditingSubject] = useState(null)

  const createSubject = async (event) => {
    event.preventDefault()
    if (inputSubjectName.trim() === '') {
      setIsShowSnack(true)
      setSnackDetail({ type: 'error', msg: 'Subject name cannot be empty!' })
      return
    }

    setLoading(true)
    const data = {
      name: inputSubjectName,
      tag: 'subject',
      category_id: params.id * 1,
      order_no: Number(inputOrderNo),
    }
    try {
      await createNewCategory(data)
      await fetchAllSubjects()
      setIsCreateSubjectOpen(false)
      setInputSubjectName('')
      setInputOrderNo('')
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Subject created successfully' })
    } catch (err) {
      console.log(err)
      setIsCreateSubjectOpen(false)
      if (err.response && err.response.data) {
        setSnackDetail({ type: 'error', msg: err.response.data.message })
        setIsShowSnack(true)
      }
    } finally {
      setLoading(false)
    }
  }

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
      await fetchAllSubjects()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Subject deleted successfully' })
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

  const fetchAllSubjects = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const s = res.data
        .filter(
          (element) =>
            params.id * 1 === element.category_id && element.tag === 'subject',
        )
        .sort((a, b) => a.order_no - b.order_no) // Order No ke hisaab se sort kiya
      setAllSubjects(s)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        if (err.response.data.message === 'subjects not found') {
          setAllSubjects([])
          setError('No subjects found. Create one!')
        } else {
          setError('Failed to fetch subjects.')
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

  const openEditSubjectForm = (subject) => {
    setEditingSubject(subject)
  }

  const closeEditSubjectForm = () => {
    setEditingSubject(null)
  }

  // Yahan updated: newOrderNo ko parameter mein liya aur data mein bheja
  const handleSaveEditSubject = async (id, newName, newOrderNo) => {
    setLoading(true)
    try {
      await editACategory(id, {
        name: newName,
        tag: 'subject',
        order_no: Number(newOrderNo), // Edit mein order_no add kiya
      })
      closeEditSubjectForm()
      await fetchAllSubjects()
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Subject updated successfully' })
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
    fetchAllSubjects()
  }, [params.id]) // Dependency array mein params.id add kiya taaki navigation par refresh ho

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Subjects</h3>
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateSubjectOpen(true)}
          >
            Create Subject
          </button>
        </div>

        {error.length > 0 && allSubjects.length === 0 && (
          <div className='h-96 flex justify-center items-center'>
            <div>
              <p className='mb-5 capitalize text-xl font-semibold text-center'>
                {error}
              </p>
              <button
                className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
                onClick={() => setIsCreateSubjectOpen(true)}
              >
                Create Subject
              </button>
            </div>
          </div>
        )}

        {allSubjects.length > 0 && (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {allSubjects.map((sub) => (
              <div
                key={sub.id}
                className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] text-blue-600 font-bold'>
                      Order: {sub.order_no}
                    </span>
                    <h4 className='capitalize text-xl font-semibold'>
                      {sub.name}
                    </h4>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='text-blue-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openEditSubjectForm(sub)}
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      className='text-red-500 hover:rounded-full hover:bg-gray-300 p-2'
                      onClick={() => openDeleteModal(sub.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
                <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                <button
                  className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm transition-all duration-150 hover:bg-blue-400 hover:text-black'
                  onClick={() => navigate(`${sub.id}`)}
                >
                  Chapters
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ------------ Create New Subject Pop up ------------------ */}
        {isCreateSubjectOpen && (
          <div className='fixed z-30 overflow-hidden bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative -mt-5 md:-mt-20 w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateSubjectOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className='px-3 py-8 w-full'>
                <p className='text-center text-xl text-blue-500 font-semibold'>
                  Create Subject
                </p>
                <form
                  onSubmit={createSubject}
                  className='py-10 flex flex-col gap-5'
                >
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Subject Name</label>
                    <input
                      required
                      type='text'
                      placeholder='Enter Your Subject Name'
                      className='p-3 rounded-sm bg-gray-200 border-none focus:outline focus:outline-blue-300'
                      onChange={(e) => setInputSubjectName(e.target.value)}
                      value={inputSubjectName}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Order No</label>
                    <input
                      required
                      type='number'
                      placeholder='Enter Order Number (e.g. 1)'
                      className='p-3 rounded-sm bg-gray-200 border-none focus:outline focus:outline-blue-300'
                      onChange={(e) => setInputOrderNo(e.target.value)}
                      value={inputOrderNo}
                    />
                  </div>
                  <div className='flex justify-center'>
                    <button
                      type='submit'
                      className='px-6 py-1.5 text-white bg-blue-500 rounded-sm'
                    >
                      Create Subject
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Delete Confirmation Pop up ------------------ */}
        {isDeleteModalOpen && (
          <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border transition-all transform scale-100'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-red-100 p-3 rounded-full mb-4'>
                  <MdWarningAmber size={40} className='text-red-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>
                  Delete Subject?
                </h3>
                <p className='text-gray-500 mt-2'>
                  Are you sure you want to delete this subject? This action
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

        {editingSubject && (
          <EditForm
            board={editingSubject}
            onClose={closeEditSubjectForm}
            onSave={handleSaveEditSubject}
          />
        )}
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Classes
