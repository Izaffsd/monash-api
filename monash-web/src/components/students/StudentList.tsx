// 'use client'

// import { useState } from 'react'
// import { AxiosError } from 'axios'
// import { Student } from '@/types'
// import Button from './ui/Button'

// interface StudentListProps {
//   students: Student[]
//   onEdit: (student: Student) => void
//   onDelete: (studentId: number) => Promise<void>
//   isLoading?: boolean
// }

// export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
//   const [deletingId, setDeletingId] = useState<number | null>(null)

//   const handleDelete = async (studentId: number) => {
//     if (!confirm('Are you sure you want to delete this student?')) return

//     setDeletingId(studentId)
//     try {
//       await onDelete(studentId)
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>
//       alert(axiosError?.response?.data?.message || 'Failed to delete student')
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   if (students.length === 0) {
//     return <p className="text-gray-500 text-center py-8">No students found</p>
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-3 py-2 text-left">ID</th>
//             <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
//             <th className="border border-gray-300 px-3 py-2 text-left">Matric No</th>
//             <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
//             <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student.student_id} className="hover:bg-gray-50">
//               <td className="border border-gray-300 px-3 py-2">{student.student_id}</td>
//               <td className="border border-gray-300 px-3 py-2">{student.student_name}</td>
//               <td className="border border-gray-300 px-3 py-2 font-mono">{student.matric_no}</td>
//               <td className="border border-gray-300 px-3 py-2">{student.email}</td>
//               <td className="border border-gray-300 px-3 py-2 text-center space-x-2">
//                 <Button
//                   onClick={() => onEdit(student)}
//                   size="sm"
//                   className="bg-blue-500 hover:bg-blue-600"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   onClick={() => handleDelete(student.student_id!)}
//                   size="sm"
//                   className="bg-red-500 hover:bg-red-600"
//                   disabled={deletingId === student.student_id}
//                 >
//                   {deletingId === student.student_id ? 'Deleting...' : 'Delete'}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
