import { response } from '../utils/response.js'
import * as authService from '../services/auth.service.js'

export const registerStudent = async (req, res, next) => {
    try {
        const data = await authService.registerStudentService(req.body)
        return response(res, 201, 'Student registered successfully', data)
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const data = await authService.loginService(req.body)
        return response(res, 200, 'Login successful', data)
    } catch (error) {
        next(error)
    }
}
