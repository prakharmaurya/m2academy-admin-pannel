// // import React, { useContext, useEffect, useState } from 'react'
// // import { useNavigate, useParams } from 'react-router-dom'
// // import { MdOutlineClose } from 'react-icons/md'
// // import { BsTrash } from 'react-icons/bs'
// // import { FaRegEdit } from 'react-icons/fa'

// // import {
// //   createNewCategory,
// //   deleteACategory,
// //   getAllCategory,
// //   editACategory,
// // } from '../../utils/api'
// // import { Context } from '../../App'
// // import Loader from '../../components/ui/Loader'
// // import EditForm from '../../components/app/EditForm'

// // const Board = () => {
// //   const params = useParams()
// //   const navigate = useNavigate()

// //   const { setIsShowSnack, setSnackDetail } = useContext(Context)
// //   const [loading, setLoading] = useState(false)
// //   const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
// //   const [classess, setClassess] = useState([])
// //   const [inputClassName, setInputClassName] = useState('')
// //   const [inputOrderNo, setInputOrderNo] = useState('') // State for order_no
// //   const [error, setError] = useState('')

// //   const [editingClass, setEditingClass] = useState(null)

// //   const createClass = async (event) => {
// //     event.preventDefault()
// //     if (inputClassName.trim() === '') {
// //       setIsShowSnack(true)
// //       setSnackDetail({ type: 'error', msg: 'Class name cannot be empty!' })
// //       return
// //     }

// //     setLoading(true)
// //     const data = {
// //       name: inputClassName,
// //       tag: 'class',
// //       category_id: params.id * 1,
// //       order_no: Number(inputOrderNo), // Isse string "1" number 1 ban jayega
// //     }
// //     try {
// //       await createNewCategory(data)
// //       await fetchClassess()
// //       setIsCreateClassOpen(false)
// //       setInputClassName('')
// //       setInputOrderNo('') // Resetting order_no
// //       setIsShowSnack(true)
// //       setSnackDetail({ type: 'success', msg: 'Class created successfully' })
// //     } catch (err) {
// //       console.log(err)
// //       setIsCreateClassOpen(false)
// //       if (err.response && err.response.data) {
// //         setSnackDetail({ type: 'error', msg: err.response.data.message })
// //         setIsShowSnack(true)
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // ... (delClass, fetchClassess, etc. functions remain same)

// //   const delClass = async (id) => {
// //     if (!window.confirm('Are you sure you want to delete this class?')) {
// //       return
// //     }
// //     setLoading(true)
// //     try {
// //       await deleteACategory(id)
// //       await fetchClassess()
// //       setIsShowSnack(true)
// //       setSnackDetail({ type: 'success', msg: 'Class deleted successfully' })
// //     } catch (err) {
// //       console.log(err)
// //       if (err.response && err.response.data) {
// //         setSnackDetail({ type: 'error', msg: err.response.data.message })
// //         setIsShowSnack(true)
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const fetchClassess = async () => {
// //     setLoading(true)
// //     setError('')
// //     try {
// //       const res = await getAllCategory()
// //       const c = res.data.filter(
// //         (element) =>
// //           params.id * 1 === element.category_id && element.tag === 'class',
// //       )
// //       setClassess(c)
// //     } catch (err) {
// //       console.log(err)
// //       if (err.response && err.response.data) {
// //         if (err.response.data.message === 'classes not found') {
// //           setClassess([])
// //           setError('No classes found. Create one!')
// //         } else {
// //           setError('Failed to fetch classes.')
// //           setSnackDetail({ type: 'error', msg: err.response.data.message })
// //           setIsShowSnack(true)
// //         }
// //       } else {
// //         setError('An unexpected error occurred.')
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const openEditClassForm = (cls) => {
// //     setEditingClass(cls)
// //   }

// //   const closeEditClassForm = () => {
// //     setEditingClass(null)
// //   }

// //   const handleSaveEditClass = async (id, newName) => {
// //     setLoading(true)
// //     try {
// //       await editACategory(id, { name: newName, tag: 'class' })
// //       closeEditClassForm()
// //       await fetchClassess()
// //       setIsShowSnack(true)
// //       setSnackDetail({ type: 'success', msg: 'Class updated successfully' })
// //     } catch (err) {
// //       console.log(err)
// //       if (err.response && err.response.data) {
// //         setSnackDetail({ type: 'error', msg: err.response.data.message })
// //         setIsShowSnack(true)
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchClassess()
// //   }, [params.id])

// //   return (
// //     <div>
// //       <div className='max-w-7xl container mx-auto px-4 py-5'>
// //         <div className='flex justify-between items-center mb-5'>
// //           <h3 className='text-2xl font-semibold'>Classes</h3>
// //           <button
// //             className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
// //             onClick={() => setIsCreateClassOpen(true)}
// //           >
// //             Create Class
// //           </button>
// //         </div>

// //         {/* List mapping... (remains same) */}
// //         {classess.length > 0 && (
// //           <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
// //             {classess.map((cls) => (
// //               <div
// //                 key={cls.id}
// //                 className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
// //               >
// //                 <div className='flex justify-between items-center'>
// //                   <h4 className='capitalize text-xl font-semibold'>
// //                     {cls.name}
// //                   </h4>
// //                   <div className='flex space-x-2'>
// //                     <button
// //                       className='text-blue-500 hover:bg-gray-300 p-2 rounded-full'
// //                       onClick={() => openEditClassForm(cls)}
// //                     >
// //                       <FaRegEdit size={20} />
// //                     </button>
// //                     <button
// //                       className='text-red-500 hover:bg-gray-300 p-2 rounded-full'
// //                       onClick={() => delClass(cls.id)}
// //                     >
// //                       <BsTrash size={20} />
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
// //                 <button
// //                   className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-400'
// //                   onClick={() => navigate(`${cls.id}`)}
// //                 >
// //                   Subjects
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* ------------ Create New Class Pop up ------------------ */}
// //         {isCreateClassOpen && (
// //           <div className='fixed z-30 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
// //             <div className='relative w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
// //               <div
// //                 className='absolute top-2 right-2 cursor-pointer'
// //                 onClick={() => setIsCreateClassOpen(false)}
// //               >
// //                 <MdOutlineClose size={25} />
// //               </div>
// //               <div className='px-3 py-8 w-full'>
// //                 <p className='text-center text-xl text-blue-500 font-semibold'>
// //                   Create Class
// //                 </p>
// //                 <form
// //                   onSubmit={createClass}
// //                   className='py-6 flex flex-col gap-4'
// //                 >
// //                   {/* Class Name Input */}
// //                   <div className='flex flex-col gap-1'>
// //                     <label className='text-sm font-medium'>Class Name</label>
// //                     <input
// //                       required
// //                       type='text'
// //                       placeholder='Enter Class Name'
// //                       className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
// //                       onChange={(e) => setInputClassName(e.target.value)}
// //                       value={inputClassName}
// //                     />
// //                   </div>

// //                   {/* Order No Input - Number Type */}
// //                   <div className='flex flex-col gap-1'>
// //                     <label className='text-sm font-medium'>Order No</label>
// //                     <input
// //                       required
// //                       type='number'
// //                       placeholder='Enter Order No (e.g. 1)'
// //                       className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
// //                       onChange={(e) => setInputOrderNo(e.target.value)}
// //                       value={inputOrderNo}
// //                     />
// //                   </div>

// //                   <div className='flex justify-center mt-2'>
// //                     <button
// //                       type='submit'
// //                       className='px-6 py-2 text-white bg-blue-500 rounded-sm'
// //                     >
// //                       Create Class
// //                     </button>
// //                   </div>
// //                 </form>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {editingClass && (
// //           <EditForm
// //             board={editingClass}
// //             onClose={closeEditClassForm}
// //             onSave={handleSaveEditClass}
// //           />
// //         )}
// //       </div>
// //       {loading && <Loader />}
// //     </div>
// //   )
// // }

// // export default Board
// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { MdOutlineClose, MdWarningAmber } from 'react-icons/md' // Added Warning Icon
// import { BsTrash } from 'react-icons/bs'
// import { FaRegEdit } from 'react-icons/fa'

// import {
//   createNewCategory,
//   deleteACategory,
//   getAllCategory,
//   editACategory,
// } from '../../utils/api'
// import { Context } from '../../App'
// import Loader from '../../components/ui/Loader'
// import EditForm from '../../components/app/EditForm'

// const Board = () => {
//   const params = useParams()
//   const navigate = useNavigate()

//   const { setIsShowSnack, setSnackDetail } = useContext(Context)
//   const [loading, setLoading] = useState(false)
//   const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)

//   // Delete Modal States
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [idToDelete, setIdToDelete] = useState(null)

//   const [classess, setClassess] = useState([])
//   const [inputClassName, setInputClassName] = useState('')
//   const [inputOrderNo, setInputOrderNo] = useState('')
//   const [error, setError] = useState('')

//   const [editingClass, setEditingClass] = useState(null)

//   const createClass = async (event) => {
//     event.preventDefault()
//     if (inputClassName.trim() === '') {
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'error', msg: 'Class name cannot be empty!' })
//       return
//     }

//     setLoading(true)
//     const data = {
//       name: inputClassName,
//       tag: 'class',
//       category_id: params.id * 1,
//       order_no: Number(inputOrderNo),
//     }
//     try {
//       await createNewCategory(data)
//       await fetchClassess()
//       setIsCreateClassOpen(false)
//       setInputClassName('')
//       setInputOrderNo('')
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Class created successfully' })
//     } catch (err) {
//       console.log(err)
//       setIsCreateClassOpen(false)
//       if (err.response && err.response.data) {
//         setSnackDetail({ type: 'error', msg: err.response.data.message })
//         setIsShowSnack(true)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Open Delete Modal
//   const openDeleteModal = (id) => {
//     setIdToDelete(id)
//     setIsDeleteModalOpen(true)
//   }

//   // Confirm Delete Action
//   const handleConfirmDelete = async () => {
//     if (!idToDelete) return
//     setLoading(true)
//     setIsDeleteModalOpen(false)
//     try {
//       await deleteACategory(idToDelete)
//       await fetchClassess()
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Class deleted successfully' })
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

//   const fetchClassess = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await getAllCategory()
//       const c = res.data
//         .filter(
//           (element) =>
//             params.id * 1 === element.category_id && element.tag === 'class',
//         )
//         .sort((a, b) => a.order_no - b.order_no) // Sorting by order_no
//       setClassess(c)
//     } catch (err) {
//       console.log(err)
//       if (err.response && err.response.data) {
//         if (err.response.data.message === 'classes not found') {
//           setClassess([])
//           setError('No classes found. Create one!')
//         } else {
//           setError('Failed to fetch classes.')
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

//   const openEditClassForm = (cls) => {
//     setEditingClass(cls)
//   }

//   const closeEditClassForm = () => {
//     setEditingClass(null)
//   }

//   const handleSaveEditClass = async (id, newName, newOrderNo) => {
//     setLoading(true)
//     try {
//       await editACategory(id, {
//         name: newName,
//         tag: 'class',
//         order_no: Number(newOrderNo),
//       })
//       closeEditClassForm()
//       await fetchClassess()
//       setIsShowSnack(true)
//       setSnackDetail({ type: 'success', msg: 'Class updated successfully' })
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
//     fetchClassess()
//   }, [params.id])

//   return (
//     <div>
//       <div className='max-w-7xl container mx-auto px-4 py-5'>
//         <div className='flex justify-between items-center mb-5'>
//           <h3 className='text-2xl font-semibold'>Classes</h3>
//           <button
//             className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
//             onClick={() => setIsCreateClassOpen(true)}
//           >
//             Create Class
//           </button>
//         </div>

//         {classess.length > 0 && (
//           <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
//             {classess.map((cls) => (
//               <div
//                 key={cls.id}
//                 className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
//               >
//                 <div className='flex justify-between items-center'>
//                   <div className='flex flex-col'>
//                     <span className='text-[10px] text-blue-600 font-bold'>
//                       Order: {cls.order_no}
//                     </span>
//                     <h4 className='capitalize text-xl font-semibold'>
//                       {cls.name}
//                     </h4>
//                   </div>
//                   <div className='flex space-x-2'>
//                     <button
//                       className='text-blue-500 hover:bg-gray-300 p-2 rounded-full'
//                       onClick={() => openEditClassForm(cls)}
//                     >
//                       <FaRegEdit size={20} />
//                     </button>
//                     <button
//                       className='text-red-500 hover:bg-gray-300 p-2 rounded-full'
//                       onClick={() => openDeleteModal(cls.id)}
//                     >
//                       <BsTrash size={20} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
//                 <button
//                   className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-400'
//                   onClick={() => navigate(`${cls.id}`)}
//                 >
//                   Subjects
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ------------ Create New Class Pop up ------------------ */}
//         {isCreateClassOpen && (
//           <div className='fixed z-30 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
//             <div className='relative w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
//               <div
//                 className='absolute top-2 right-2 cursor-pointer'
//                 onClick={() => setIsCreateClassOpen(false)}
//               >
//                 <MdOutlineClose size={25} />
//               </div>
//               <div className='px-3 py-8 w-full'>
//                 <p className='text-center text-xl text-blue-500 font-semibold'>
//                   Create Class
//                 </p>
//                 <form
//                   onSubmit={createClass}
//                   className='py-6 flex flex-col gap-4'
//                 >
//                   <div className='flex flex-col gap-1'>
//                     <label className='text-sm font-medium'>Class Name</label>
//                     <input
//                       required
//                       type='text'
//                       placeholder='Enter Class Name'
//                       className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
//                       onChange={(e) => setInputClassName(e.target.value)}
//                       value={inputClassName}
//                     />
//                   </div>
//                   <div className='flex flex-col gap-1'>
//                     <label className='text-sm font-medium'>Order No</label>
//                     <input
//                       required
//                       type='number'
//                       placeholder='Enter Order No'
//                       className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
//                       onChange={(e) => setInputOrderNo(e.target.value)}
//                       value={inputOrderNo}
//                     />
//                   </div>
//                   <div className='flex justify-center mt-2'>
//                     <button
//                       type='submit'
//                       className='px-6 py-2 text-white bg-blue-500 rounded-sm'
//                     >
//                       Create Class
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ------------ Delete Confirmation Modal (NEW) ------------------ */}
//         {isDeleteModalOpen && (
//           <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
//             <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border'>
//               <div className='flex flex-col items-center text-center'>
//                 <div className='bg-red-100 p-3 rounded-full mb-4'>
//                   <MdWarningAmber size={40} className='text-red-600' />
//                 </div>
//                 <h3 className='text-xl font-bold text-gray-800'>
//                   Delete Class?
//                 </h3>
//                 <p className='text-gray-500 mt-2'>
//                   Are you sure you want to delete this class? All associated
//                   subjects will be affected.
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

//         {editingClass && (
//           <EditForm
//             board={editingClass}
//             onClose={closeEditClassForm}
//             onSave={handleSaveEditClass}
//           />
//         )}
//       </div>
//       {loading && <Loader />}
//     </div>
//   )
// }

// export default Board
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
} from '../../utils/api'
import { Context } from '../../App'
import Loader from '../../components/ui/Loader'
import EditForm from '../../components/app/EditForm'

const Board = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { setIsShowSnack, setSnackDetail } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const [classess, setClassess] = useState([])
  const [inputClassName, setInputClassName] = useState('')
  const [inputOrderNo, setInputOrderNo] = useState('')
  const [error, setError] = useState('')

  const [editingClass, setEditingClass] = useState(null)

  // 1. Fetch Classes and Sort by Order No
  const fetchClassess = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllCategory()
      const c = res.data
        .filter(
          (element) =>
            params.id * 1 === element.category_id && element.tag === 'class',
        )
        .sort((a, b) => a.order_no - b.order_no) // Sorting logic
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

  // 2. Create Class Logic
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
      category_id: params.id * 1,
      order_no: Number(inputOrderNo),
    }
    try {
      await createNewCategory(data)
      await fetchClassess()
      setIsCreateClassOpen(false)
      setInputClassName('')
      setInputOrderNo('')
      setIsShowSnack(true)
      setSnackDetail({ type: 'success', msg: 'Class created successfully' })
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

  // 3. Edit Class Logic (Handles Order No)
  const openEditClassForm = (cls) => {
    setEditingClass(cls)
  }

  const closeEditClassForm = () => {
    setEditingClass(null)
  }

  const handleSaveEditClass = async (id, newName, newOrderNo) => {
    setLoading(true)
    try {
      await editACategory(id, {
        name: newName,
        tag: 'class',
        order_no: Number(newOrderNo), // Updated Order No
      })
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

  // 4. Delete Logic
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
      setIdToDelete(null)
    }
  }

  useEffect(() => {
    fetchClassess()
  }, [params.id])

  return (
    <div>
      <div className='max-w-7xl container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-semibold'>Classes</h3>
          <button
            className='px-5 py-1.5 bg-blue-600 text-white rounded-sm'
            onClick={() => setIsCreateClassOpen(true)}
          >
            Create Class
          </button>
        </div>

        {/* Classes Grid */}
        {classess.length > 0 ? (
          <div className='py-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {classess.map((cls) => (
              <div
                key={cls.id}
                className='bg-blue-50 px-3 py-5 rounded-md border border-blue-300'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] text-blue-600 font-bold uppercase'>
                      Order: {cls.order_no}
                    </span>
                    <h4 className='capitalize text-xl font-semibold'>
                      {cls.name}
                    </h4>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='text-blue-500 hover:bg-gray-300 p-2 rounded-full transition-colors'
                      onClick={() => openEditClassForm(cls)}
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      className='text-red-500 hover:bg-gray-300 p-2 rounded-full transition-colors'
                      onClick={() => openDeleteModal(cls.id)}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>
                </div>
                <div className='my-2 border-b border-b-gray-600/50 opacity-30'></div>
                <button
                  className='mt-1 px-4 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors'
                  onClick={() => navigate(`${cls.id}`)}
                >
                  Subjects
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className='text-center text-gray-500 mt-10'>
              {error || 'No classes found.'}
            </p>
          )
        )}

        {/* ------------ Create New Class Pop up ------------------ */}
        {isCreateClassOpen && (
          <div className='fixed z-30 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-1/2 lg:w-1/3 shadow rounded-sm bg-white border'>
              <div
                className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setIsCreateClassOpen(false)}
              >
                <MdOutlineClose size={25} />
              </div>
              <div className='px-3 py-8 w-full'>
                <p className='text-center text-xl text-blue-500 font-semibold'>
                  Create Class
                </p>
                <form
                  onSubmit={createClass}
                  className='py-6 flex flex-col gap-4'
                >
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>Class Name</label>
                    <input
                      required
                      type='text'
                      placeholder='Enter Class Name'
                      className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
                      onChange={(e) => setInputClassName(e.target.value)}
                      value={inputClassName}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>Order No</label>
                    <input
                      required
                      type='number'
                      placeholder='Enter Order No (e.g. 1)'
                      className='p-3 rounded-sm bg-gray-100 border focus:outline-blue-300'
                      onChange={(e) => setInputOrderNo(e.target.value)}
                      value={inputOrderNo}
                    />
                  </div>
                  <div className='flex justify-center mt-2'>
                    <button
                      type='submit'
                      className='px-6 py-2 text-white bg-blue-500 rounded-sm'
                    >
                      Create Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Delete Confirmation Modal ------------------ */}
        {isDeleteModalOpen && (
          <div className='fixed z-40 bg-black/60 inset-0 h-screen flex justify-center items-center p-4'>
            <div className='relative w-11/12 md:w-[400px] shadow-lg rounded-md bg-white p-6 border'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-red-100 p-3 rounded-full mb-4'>
                  <MdWarningAmber size={40} className='text-red-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>
                  Delete Class?
                </h3>
                <p className='text-gray-500 mt-2'>
                  Are you sure you want to delete this class? All associated
                  subjects will be affected.
                </p>
                <div className='flex gap-3 mt-8 w-full'>
                  <button
                    className='flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 font-medium'
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 font-medium'
                    onClick={handleConfirmDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Edit Class Modal ------------------ */}
        {editingClass && (
          <EditForm
            board={editingClass}
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
