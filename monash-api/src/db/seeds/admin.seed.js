/**
 * Seed: Admin user
 *
 * Run once after the 001_auth_tables migration:
 *   node monash-api/src/db/seeds/admin.seed.js
 *
 * Creates a single ADMIN user for testing protected routes.
 * Change the email / password below before running in production.
 */

import 'dotenv/config'
import bcrypt from 'bcrypt'
import db from '../../config/connection.js'

const ADMIN_EMAIL    = 'admin@monash.edu'
const ADMIN_PASSWORD = 'Admin@1234'
const ADMIN_NAME     = 'System Admin'

const run = async () => {
    try {
        const [existing] = await db.execute(
            'SELECT user_id FROM users WHERE email = ?',
            [ADMIN_EMAIL]
        )

        if (existing.length > 0) {
            console.log(`Admin user '${ADMIN_EMAIL}' already exists. Skipping.`)
            process.exit(0)
        }

        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)

        await db.execute(
            `INSERT INTO users (user_id, email, password, name, type, status)
             VALUES (UUID(), ?, ?, ?, 'ADMIN', 'ACTIVE')`,
            [ADMIN_EMAIL, hash, ADMIN_NAME]
        )

        console.log(`Admin user created successfully.`)
        console.log(`  Email   : ${ADMIN_EMAIL}`)
        console.log(`  Password: ${ADMIN_PASSWORD}`)
        console.log(`  Type    : ADMIN`)
        process.exit(0)
    } catch (err) {
        console.error('Seed failed:', err.message)
        process.exit(1)
    }
}

run()
