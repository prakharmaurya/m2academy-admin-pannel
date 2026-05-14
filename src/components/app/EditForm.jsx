// import React, { useState, useEffect } from 'react'
// import { MdOutlineClose } from 'react-icons/md' // Import the close icon for the form

// const EditForm = ({ board, onClose, onSave }) => {
//   const [boardName, setBoardName] = useState('')

//   // Use useEffect to update form fields when the 'board' prop changes
//   useEffect(() => {
//     if (board) {
//       setBoardName(board.name)
//     }
//   }, [board])

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (boardName.trim() === '') {
//       alert('Board name cannot be empty!')
//       return
//     }
//     // Call the onSave function passed from the parent component
//     onSave(board.id, boardName) // Pass board.id and the new name
//   }

//   if (!board) {
//     return null // Don't render if no board is provided
//   }

//   return (
//     // Modal overlay for responsiveness
//     <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4'>
//       {' '}
//       {/* Added p-4 for padding on small screens */}
//       <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative'>
//         {' '}
//         {/* Added relative for close button positioning */}
//         <button
//           onClick={onClose}
//           className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
//         >
//           <MdOutlineClose size={25} />
//         </button>
//         <h2 className='text-2xl font-bold mb-4 text-center'>
//           Edit Board: {board.name}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-4'>
//             <label
//               htmlFor='boardName'
//               className='block text-gray-700 text-sm font-bold mb-2'
//             >
//               Board Name:
//             </label>
//             <input
//               type='text'
//               id='boardName'
//               className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
//               value={boardName}
//               onChange={(e) => setBoardName(e.target.value)}
//               required
//             />
//           </div>
//           <div className='flex justify-end space-x-3 mt-6'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
//             >
//               Cancel
//             </button>
//             <button
//               type='submit'
//               className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default EditForm
// src/components/EditForm.jsx
import React, { useState, useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'

const EditForm = ({ board, onClose, onSave }) => {
  const [boardName, setBoardName] = useState('')
  const [orderNo, setOrderNo] = useState('') // New state for Order Number

  // Use useEffect to update form fields when the 'board' prop changes
  useEffect(() => {
    if (board) {
      setBoardName(board.name)
      // Initialize orderNo from existing data, if it exists
      setOrderNo(board.order_no || '')
    }
  }, [board])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (boardName.trim() === '') {
      alert('Name cannot be empty!')
      return
    }
    if (orderNo === '') {
      alert('Order number cannot be empty!')
      return
    }

    // Pass board.id, the new name, and the new order number back to parent
    onSave(board.id, boardName, orderNo)
  }

  if (!board) {
    return null
  }

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm'>
      <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors'
        >
          <MdOutlineClose size={25} />
        </button>

        <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>
          Edit Details
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Input */}
          <div>
            <label
              htmlFor='boardName'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Name:
            </label>
            <input
              type='text'
              id='boardName'
              className='shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all'
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              placeholder='Enter name'
            />
          </div>

          {/* Order No Input - Added this field */}
          <div>
            <label
              htmlFor='orderNo'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Order Number:
            </label>
            <input
              type='number'
              id='orderNo'
              className='shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all'
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              required
              placeholder='e.g. 1'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 mt-8'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors shadow-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditForm
