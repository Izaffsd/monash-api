// Course types
export interface Course {
  course_id: number
  course_code: string
  course_name: string
}

export interface CourseResponse {
  statusCode: number
  payload: Course | Course[]
  message: string
  errorCode?: string
}

// Student types
export interface Student {
  student_id?: number
  matric_no: string
  no_kp: string
  email: string
  student_name: string
  address?: string
  gender?: string
  course_id: number
}

export interface StudentResponse {
  statusCode: number
  payload: Student | Student[]
  message: string
  errorCode?: string
}

// Generic API Response
export interface ApiResponse<T> {
  statusCode: number
  payload: T
  message: string
  errorCode?: string
}
