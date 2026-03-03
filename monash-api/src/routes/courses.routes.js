import express from 'express'
import {
    getAllCourses,
    getCourseByCode,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/courses.controller.js'
import { validateZod } from '../middleware/validateZod.middleware.js'
 import { auth, requireRoles } from '../middleware/auth.middleware.js'
import {
    getCourseByIdSchema,
    getCourseByCodeSchema,
    createCourseSchema,
    updateCourseSchema,
    deleteCourseSchema
} from '../validations/courseValidation.js'

const router = express.Router()

// GET — ADMIN, HEAD_LECTURER, LECTURER
router.get('/courses', auth,
    requireRoles('ADMIN', 'HEAD_LECTURER', 'LECTURER'),
    getAllCourses
)
router.get('/courses/:course_code', auth,
    requireRoles('ADMIN', 'HEAD_LECTURER', 'LECTURER'),
    validateZod(getCourseByCodeSchema, 'params'),
    getCourseByCode
)

// POST / PUT / DELETE — ADMIN only
router.post('/courses', auth,
    requireRoles('ADMIN'),
    validateZod(createCourseSchema, 'body'),
    createCourse
)
router.put('/courses/:course_id', auth,
    requireRoles('ADMIN'),
    validateZod(getCourseByIdSchema, 'params'),
    validateZod(updateCourseSchema, 'body'),
    updateCourse
)
router.delete('/courses/:course_id', auth,
    requireRoles('ADMIN'),
    validateZod(deleteCourseSchema, 'params'),
    deleteCourse
)

export default router