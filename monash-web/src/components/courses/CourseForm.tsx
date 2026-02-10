// 'use client'

// import { useState } from 'react'
// import { AxiosError } from 'axios'
// import { Course } from '@/types'
// import Button from './ui/Button'

// interface CourseFormProps {
//   course?: Course
//   onSubmit: (course: Course) => Promise<void>
//   isLoading?: boolean
// }

// export default function CourseForm({ course, onSubmit, isLoading = false }: CourseFormProps) {
//   const [formData, setFormData] = useState<Course>({
//     course_id: course?.course_id || 0,
//     course_code: course?.course_code || '',
//     course_name: course?.course_name || '',
//   })

//   const [error, setError] = useState('')

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     setError('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!formData.course_code.trim() || !formData.course_name.trim()) {
//       setError('All fields are required')
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
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Course Code</label>
//         <input
//           type="text"
//           name="course_code"
//           value={formData.course_code}
//           onChange={handleChange}
//           placeholder="e.g., CS101"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           disabled={isLoading}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Course Name</label>
//         <input
//           type="text"
//           name="course_name"
//           value={formData.course_name}
//           onChange={handleChange}
//           placeholder="e.g., Introduction to Computer Science"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           disabled={isLoading}
//         />
//       </div>

//       {error && <div className="text-red-600 text-sm">{error}</div>}

//       <Button type="submit" disabled={isLoading}>
//         {isLoading ? 'Processing...' : course ? 'Update Course' : 'Create Course'}
//       </Button>
//     </form>
//   )
// }
