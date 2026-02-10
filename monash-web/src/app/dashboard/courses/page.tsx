'use client'

import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import CourseForm from '@/components/CourseForm'
import CourseList from '@/components/CourseList'
import { Course } from '@/types'
import { courseService } from '@/services/course'
import Button from '@/components/ui/Button'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const response = await courseService.getAllCourses()
      const courseData = Array.isArray(response.payload) ? response.payload : [response.payload]
      setCourses(courseData)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setMessage(axiosError?.response?.data?.message || 'Failed to load courses')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (courseData: Course) => {
    try {
      setIsLoading(true)
      if (courseData.course_id) {
        await courseService.updateCourse(courseData)
        setMessage('Course updated successfully!')
      } else {
        await courseService.createCourse(courseData)
        setMessage('Course created successfully!')
      }
      setSelectedCourse(undefined)
      setIsFormVisible(false)
      await loadCourses()
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setMessage(axiosError?.response?.data?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: number) => {
    try {
      setIsLoading(true)
      await courseService.deleteCourse(courseId)
      setMessage('Course deleted successfully!')
      await loadCourses()
    } catch (error: unknown) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setIsFormVisible(true)
  }

  const handleNewCourse = () => {
    setSelectedCourse(undefined)
    setIsFormVisible(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
            <p className="mt-2 text-gray-600">Manage all courses in the system</p>
          </div>
          <Button
            onClick={handleNewCourse}
            className="bg-green-600 hover:bg-green-700"
          >
            + New Course
          </Button>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.includes('success')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        {isFormVisible && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button
                onClick={() => {
                  setIsFormVisible(false)
                  setSelectedCourse(undefined)
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <CourseForm
              course={selectedCourse}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading && !isFormVisible ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <CourseList
              courses={courses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}
