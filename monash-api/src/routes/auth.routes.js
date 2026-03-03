import express from 'express'
import { registerStudent, login } from '../controllers/auth.controller.js'
import { validateZod } from '../middleware/validateZod.middleware.js'
import { registerStudentSchema, loginSchema } from '../validations/authValidation.js'

const router = express.Router()

router.get('/hi', (req, res) => {
    res.json({
        message: 'Hello World',
        timestamp: new Date().toISOString()
    })
})

// POST /api/auth/register
router.post('/register', validateZod(registerStudentSchema, 'body'), registerStudent)

// POST /api/auth/login
router.post('/login', validateZod(loginSchema, 'body'), login)

export default router
