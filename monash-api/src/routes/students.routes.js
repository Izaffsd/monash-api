import express from 'express'
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/students.controller.js'
import { validateZod } from '../middleware/validateZod.middleware.js'
import { auth, requireRoles } from '../middleware/auth.middleware.js'
import {
    getStudentByIdSchema,
    createStudentSchema,
    updateStudentSchema,
    deleteStudentSchema
} from '../validations/studentValidation.js'

const router = express.Router()

// GET — ADMIN, HEAD_LECTURER, LECTURER
router.get('/students', auth,
    requireRoles('ADMIN', 'HEAD_LECTURER', 'LECTURER'),
    getAllStudents
)
router.get('/students/:student_id', auth,
    requireRoles('ADMIN', 'HEAD_LECTURER', 'LECTURER'),
    validateZod(getStudentByIdSchema, 'params'),
    getStudentById
)

// POST / PUT / DELETE — ADMIN only
router.post('/students', auth,
    requireRoles('ADMIN'),
    validateZod(createStudentSchema, 'body'),
    createStudent
)
router.put('/students/:student_id', auth,
    requireRoles('ADMIN'),
    validateZod(getStudentByIdSchema, 'params'),
    validateZod(updateStudentSchema, 'body'),
    updateStudent
)
router.delete('/students/:student_id', auth,
    requireRoles('ADMIN'),
    validateZod(deleteStudentSchema, 'params'),
    deleteStudent
)

export default router