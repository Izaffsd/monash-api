import { z } from 'zod'

const email = z.string()
    .min(1, 'Email is required')
    .trim()
    .toLowerCase()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'Invalid email format'
    })

const password = z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    )

const studentNumber = z.string()
    .min(1, 'Student number is required')
    .transform((val) => val.toUpperCase().trim())
    .refine((val) => /^[A-Z]{2,4}[0-9]{4,5}$/.test(val), {
        message: 'Invalid student number format (e.g. SE0001, LAW0504)'
    })

export const registerStudentSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email,
    password,
    confirm_password: z.string().min(1, 'Confirm password is required'),
    student_number: studentNumber,
}).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
})

export const loginSchema = z.object({
    email,
    password: z.string().min(1, 'Password is required'),
})
