import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import db from '../config/connection.js'
import { response } from '../utils/response.js'
import { FIND_USER_BY_ID } from '../services/auth.service.js'

/**
 * auth — verifies the Bearer token and loads the full user onto req.user.
 *
 * On failure returns 401 directly (does NOT call next(err)) so that error
 * messages are consistent and never leak implementation details.
 */
export const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response(res, 401, 'Unauthorized', null, 'UNAUTHORIZED_401')
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
        decoded = jwt.verify(token, env.JWT_SECRET)
    } catch {
        return response(res, 401, 'Invalid or expired token', null, 'INVALID_TOKEN_401')
    }

    const [rows] = await db.execute(FIND_USER_BY_ID, [decoded.userId])

    if (rows.length === 0) {
        return response(res, 401, 'Unauthorized', null, 'UNAUTHORIZED_401')
    }

    const user = rows[0]

    if (user.status !== 'ACTIVE') {
        return response(res, 401, 'Account is inactive', null, 'ACCOUNT_INACTIVE_401')
    }

    // Attach user to request (no password — the SELECT query does not include it)
    req.user = user
    next()
}

/**
 * requireRoles(...roles) — must come after `auth`.
 * Returns 403 if req.user.type is not in the allowed list.
 *
 * Usage: requireRoles('ADMIN', 'HEAD_LECTURER')
 */
export const requireRoles = (...allowedTypes) => (req, res, next) => {
    if (!req.user) {
        return response(res, 401, 'Unauthorized', null, 'UNAUTHORIZED_401') // no token provided
    }

    if (!allowedTypes.includes(req.user.type)) {
        return response(
            res,
            403,
            'Forbidden: you do not have permission to perform this action',
            null,
            'FORBIDDEN_403'
        )
    }

    next()
}
