import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/connection.js'
import env from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import { extractStudentNumberPrefix } from '../validations/studentValidation.js'

const BCRYPT_ROUNDS = 10 // avg time

// Single SQL fragment reused by register, login, and the auth middleware.
// Returns one flat row; nested objects are assembled in buildAuthUserPayload().
const USER_WITH_RELATIONS_SELECT = `
    SELECT
        u.user_id, u.email, u.name, u.type, u.status,
        u.is_email_verified, u.email_verified_at,
        u.created_at, u.updated_at,
        u.student_id, u.lecturer_id, u.head_lecturer_id,
        s.student_number, s.mykad_number, s.address, s.gender,
        c.course_id, c.course_code, c.course_name,
        l.department  AS lecturer_department,
        hl.department AS head_lecturer_department
    FROM users u
    LEFT JOIN students       s  ON u.student_id       = s.student_id
    LEFT JOIN courses        c  ON s.course_id        = c.course_id
    LEFT JOIN lecturers      l  ON u.lecturer_id      = l.lecturer_id
    LEFT JOIN head_lecturers hl ON u.head_lecturer_id = hl.head_lecturer_id
`

export const FIND_USER_BY_ID    = `${USER_WITH_RELATIONS_SELECT} WHERE u.user_id = ?`
export const FIND_USER_BY_EMAIL = `${USER_WITH_RELATIONS_SELECT} WHERE u.email   = ?`

// Same query but also returns the hashed password (needed only for login).
export const FIND_USER_BY_EMAIL_WITH_PASSWORD = `
    SELECT
        u.user_id, u.email, u.password AS hashed_password,
        u.name, u.type, u.status,
        u.is_email_verified, u.email_verified_at,
        u.created_at, u.updated_at,
        u.student_id, u.lecturer_id, u.head_lecturer_id,
        s.student_number, s.mykad_number, s.address, s.gender,
        c.course_id, c.course_code, c.course_name,
        l.department  AS lecturer_department,
        hl.department AS head_lecturer_department
    FROM users u
    LEFT JOIN students       s  ON u.student_id       = s.student_id
    LEFT JOIN courses        c  ON s.course_id        = c.course_id
    LEFT JOIN lecturers      l  ON u.lecturer_id      = l.lecturer_id
    LEFT JOIN head_lecturers hl ON u.head_lecturer_id = hl.head_lecturer_id
    WHERE u.email = ?
`

/**
 * Build the plain snake_case user payload.
 * response.js will auto-convert all keys to camelCase before sending.
 */
export const buildAuthUserPayload = (row) => ({
    user_id:           row.user_id,
    email:             row.email,
    name:              row.name,
    type:              row.type,
    status:            row.status,
    is_email_verified: Boolean(row.is_email_verified),
    email_verified_at: row.email_verified_at ?? null,
    created_at:        row.created_at,
    updated_at:        row.updated_at,
    student_id:        row.student_id        ?? null,
    lecturer_id:       row.lecturer_id       ?? null,
    head_lecturer_id:  row.head_lecturer_id  ?? null,
    student: row.student_id ? {
        student_number: row.student_number,
        mykad_number:   row.mykad_number ?? null,
        address:        row.address      ?? null,
        gender:         row.gender       ?? null,
        course: row.course_id ? {
            course_id:   row.course_id,
            course_code: row.course_code,
            course_name: row.course_name,
        } : null,
    } : null,
    lecturer: row.lecturer_id ? {
        lecturer_id: row.lecturer_id,
        department:  row.lecturer_department ?? null,
    } : null,
    head_lecturer: row.head_lecturer_id ? {
        head_lecturer_id: row.head_lecturer_id,
        department:       row.head_lecturer_department ?? null,
    } : null,
})

const signToken = (userId, type) =>
    jwt.sign(
        { userId, type },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    )

// ---------------------------------------------------------------------------
// Register student
// ---------------------------------------------------------------------------
export const registerStudentService = async (data) => {
    const { name, email, password, student_number } = data

    // 1. Resolve course from student_number prefix
    const prefix = extractStudentNumberPrefix(student_number)
    if (!prefix) {
        throw new AppError(
            'Invalid student number format',
            400,
            'INVALID_STUDENT_NUMBER_400'
        )
    }

    const [courseResult] = await db.execute(
        'SELECT course_id FROM courses WHERE course_code = ?',
        [prefix]
    )
    if (courseResult.length === 0) {
        throw new AppError('Course does not exist', 404, 'COURSE_NOT_FOUND_404')
    }

    // 2. Uniqueness checks — fail fast with descriptive error codes
    const [emailCheck] = await db.execute(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
    )
    if (emailCheck.length > 0) {
        throw new AppError(
            `'${email}' is already registered`,
            409,
            'EMAIL_ALREADY_EXISTS_409'
        )
    }

    const [numberCheck] = await db.execute(
        'SELECT student_id FROM students WHERE student_number = ?',
        [student_number]
    )
    if (numberCheck.length > 0) {
        throw new AppError(
            `Student number '${student_number}' is already registered`,
            409,
            'STUDENT_NUMBER_ALREADY_EXISTS_409'
        )
    }

    // 3. Insert student record
    const [studentInsert] = await db.execute(
        'INSERT INTO students (student_number, course_id) VALUES (?, ?)',
        [student_number, courseResult[0].course_id]
    )

    // 4. Hash password and insert user
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS)

    await db.execute(
        `INSERT INTO users
             (user_id, email, password, name, type, status, student_id)
         VALUES (UUID(), ?, ?, ?, 'STUDENT', 'ACTIVE', ?)`,
        [email, hashedPassword, name, studentInsert.insertId]
    )

    // 5. Re-fetch with all joins to build the response (use email as key)
    const [rows] = await db.execute(FIND_USER_BY_EMAIL, [email])

    if (rows.length === 0) {
        throw new AppError('Registration failed', 500, 'REGISTRATION_FAILED_500')
    }

    const token = signToken(rows[0].user_id, rows[0].type)
    return { token, user: buildAuthUserPayload(rows[0]) }
}

// ---------------------------------------------------------------------------
// Login (all user types)
// ---------------------------------------------------------------------------
export const loginService = async (data) => {
    const { email, password } = data

    // Use a single message to avoid leaking whether the email exists
    const invalidCredentials = new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS_401'
    )

    const [rows] = await db.execute(FIND_USER_BY_EMAIL_WITH_PASSWORD, [email])

    if (rows.length === 0) throw invalidCredentials

    const row = rows[0]

    if (row.status !== 'ACTIVE') {
        throw new AppError('Account is inactive', 401, 'ACCOUNT_INACTIVE_401')
    }

    const passwordMatch = await bcrypt.compare(password, row.hashed_password)
    if (!passwordMatch) throw invalidCredentials

    const token = signToken(row.user_id, row.type)
    return { token, user: buildAuthUserPayload(row) }
}
