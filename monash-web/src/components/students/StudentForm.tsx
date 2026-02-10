// 'use client'

// import { useState } from 'react'
// import { AxiosError } from 'axios'
// import { Student, Course } from '@/types'
// import Button from './ui/Button'

// interface StudentFormProps {
//   student?: Student
//   courses: Course[]
//   onSubmit: (student: Student) => Promise<void>
//   isLoading?: boolean
// }

// export default function StudentForm({ student, courses, onSubmit, isLoading = false }: StudentFormProps) {
//   const [formData, setFormData] = useState<Student>({
//     student_id: student?.student_id,
//     matric_no: student?.matric_no || '',
//     no_kp: student?.no_kp || '',
//     email: student?.email || '',
//     student_name: student?.student_name || '',
//     address: student?.address || '',
//     gender: student?.gender || '',
//     course_id: student?.course_id || 0,
//   })

//   const [error, setError] = useState('')

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'course_id' ? parseInt(value) : value,
//     }))
//     setError('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (
//       !formData.matric_no.trim() ||
//       !formData.no_kp.trim() ||
//       !formData.email.trim() ||
//       !formData.student_name.trim() ||
//       !formData.course_id
//     ) {
//       setError('All required fields must be filled')
//       return
//     }

//     try {
//       await onSubmit(formData)
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>
//       setError(axiosError?.response?.data?.message || 'An error occurred')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Matric No *</label>
//           <input
//             type="text"
//             name="matric_no"
//             value={formData.matric_no}
//             onChange={handleChange}
//             placeholder="e.g., A123456"
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">No KP *</label>
//           <input
//             type="text"
//             name="no_kp"
//             value={formData.no_kp}
//             onChange={handleChange}
//             placeholder="e.g., 123456-12-1234"
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             disabled={isLoading}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Student Name *</label>
//         <input
//           type="text"
//           name="student_name"
//           value={formData.student_name}
//           onChange={handleChange}
//           placeholder="e.g., John Doe"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           disabled={isLoading}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email *</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="e.g., john@example.com"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           disabled={isLoading}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Gender</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             disabled={isLoading}
//           >
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>  {/* value shouldnt be "M" */}
//             <option value="Female">Female</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course *</label>
//           <select
//             name="course_id"
//             value={formData.course_id}
//             onChange={handleChange}
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             disabled={isLoading}
//           >
//             <option value="">Select Course</option>
//             {courses.map((course) => (
//               <option key={course.course_id} value={course.course_id}>
//                 {course.course_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Address</label>
//         <input
//           type="text"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           placeholder="e.g., 123 Main St, City"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           disabled={isLoading}
//         />
//       </div>

//       {error && <div className="text-red-600 text-sm">{error}</div>}

//       <Button type="submit" disabled={isLoading}>
//         {isLoading ? 'Processing...' : student ? 'Update Student' : 'Create Student'}
//       </Button>
//     </form>
//   )
// }
