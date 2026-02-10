// 'use client'

// import { useState } from 'react'
// import { AxiosError } from 'axios'
// import { Course } from '@/types'
// import Button from './ui/Button'

// interface CourseListProps {
//   courses: Course[]
//   onEdit: (course: Course) => void
//   onDelete: (courseId: number) => Promise<void>
//   isLoading?: boolean
// }

// export default function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
//   const [deletingId, setDeletingId] = useState<number | null>(null)

//   const handleDelete = async (courseId: number) => {
//     if (!confirm('Are you sure you want to delete this course?')) return

//     setDeletingId(courseId)
//     try {
//       await onDelete(courseId)
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>
//       alert(axiosError?.response?.data?.message || 'Failed to delete course')
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   if (courses.length === 0) {
//     return <p className="text-gray-500 text-center py-8">No courses found</p>
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
//             <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {courses.map((course: Course) => {
//             const courseId = course.course_id
//             const courseCode = course.course_code
//             const courseName = course.course_name
            
//             return (
//             <tr key={courseId} className="hover:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">{courseId}</td>
//               <td className="border border-gray-300 px-4 py-2 font-mono">{courseCode}</td>
//               <td className="border border-gray-300 px-4 py-2">{courseName}</td>
//               <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
//                 <Button
//                   onClick={() => onEdit(course)}
//                   size="sm"
//                   className="bg-blue-500 hover:bg-blue-600"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   onClick={() => handleDelete(courseId)}
//                   size="sm"
//                   className="bg-red-500 hover:bg-red-600"
//                   disabled={deletingId === courseId}
//                 >
//                   {deletingId === courseId ? 'Deleting...' : 'Delete'}
//                 </Button>
//               </td>
//             </tr>
//             )
//           })}
//         </tbody>
//       </table>
//     </div>
//   )
// }
