// 'use client'

// import { useEffect, useState } from 'react'
// import { AxiosError } from 'axios'
// import StudentForm from '@/components/students/StudentForm'
// import StudentList from '@/components/courses/StudentList'
// import { Student, Course } from '@/types'
// import { studentService } from '@/services/student'
// import { courseService } from '@/services/course'
// import Button from '@/components/ui/Button'

// export default function StudentsPage() {
//   const [students, setStudents] = useState<Student[]>([])
//   const [courses, setCourses] = useState<Course[]>([])
//   const [selectedStudent, setSelectedStudent] = useState<Student | undefined>()
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFormVisible, setIsFormVisible] = useState(false)
//   const [message, setMessage] = useState('')

//   useEffect(() => {
//     loadData()
//   }, [])

//   const loadData = async () => {
//     try {A
//       setIsLoading(true)
//       const [studentsRes, coursesRes] = await Promise.all([
//         studentService.getAllStudents(),
//         courseService.getAllCourses(),
//       ])

//       const studentData = Array.isArray(studentsRes.payload) ? studentsRes.payload : [studentsRes.payload]
//       const courseData = Array.isArray(coursesRes.payload) ? coursesRes.payload : [coursesRes.payload]

//       setStudents(studentData)
//       setCourses(courseData)
//     } catch (error: unknown) {
//       const axiosError = error as AxiosError<{ message: string }>
//       setMessage(axiosError?.response?.data?.message || 'Failed to load data')
//       console.error(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSubmit = async (studentData: Student) => {
//     try {
//       setIsLoading(true)
//       if (studentData.student_id) {
//         await studentService.updateStudent(studentData)
//         setMessage('Student updated successfully!')
//       } else {
//         await studentService.createStudent(studentData)
//         setMessage('Student created successfully!')
//       }
//       setSelectedStudent(undefined)
//       setIsFormVisible(false)
//       await loadData()
//     } catch (error: unknown) {
//       const axiosError = error as AxiosError<{ message: string }>
//       setMessage(axiosError?.response?.data?.message || 'An error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDelete = async (studentId: number) => {
//     try {
//       setIsLoading(true)
//       await studentService.deleteStudent(studentId)
//       setMessage('Student deleted successfully!')
//       await loadData()
//     } catch (error: unknown) {
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEdit = (student: Student) => {
//     setSelectedStudent(student)
//     setIsFormVisible(true)
//   }

//   const handleNewStudent = () => {
//     setSelectedStudent(undefined)
//     setIsFormVisible(true)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
//             <p className="mt-2 text-gray-600">Manage all students in the system</p>
//           </div>
//           <Button
//             onClick={handleNewStudent}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             + New Student
//           </Button>
//         </div>

//         {message && (
//           <div
//             className={`mb-4 p-4 rounded-md ${
//               message.includes('success')
//                 ? 'bg-green-50 text-green-800'
//                 : 'bg-red-50 text-red-800'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {isFormVisible && (
//           <div className="mb-8 bg-white p-6 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">
//                 {selectedStudent ? 'Edit Student' : 'Create New Student'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setIsFormVisible(false)
//                   setSelectedStudent(undefined)
//                 }}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>
//             <StudentForm
//               student={selectedStudent}
//               courses={courses}
//               onSubmit={handleSubmit}
//               isLoading={isLoading}
//             />
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {isLoading && !isFormVisible ? (
//             <div className="p-8 text-center text-gray-500">Loading...</div>
//           ) : (
//             <StudentList
//               students={students}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               isLoading={isLoading}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
