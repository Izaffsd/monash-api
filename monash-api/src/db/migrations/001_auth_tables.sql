-- ============================================================
-- Migration 001: Auth Tables
-- Run ONCE against your database before starting the server.
--
-- What this migration does:
--   1. Creates `lecturers` table
--   2. Creates `head_lecturers` table
--   3. Alters `students`:  drops email + student_name columns
--                          (they move to `users`),
--                          makes mykad_number nullable so students
--                          can register without it
--   4. Creates `users` table with FK references to all three
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. lecturers
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lecturers` (
    `lecturer_id`  CHAR(36)     NOT NULL DEFAULT (UUID()),
    `department`   VARCHAR(100) NULL,
    `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`lecturer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------
-- 2. head_lecturers
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `head_lecturers` (
    `head_lecturer_id` CHAR(36)     NOT NULL DEFAULT (UUID()),
    `department`       VARCHAR(100) NULL,
    `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`head_lecturer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------
-- 3. Alter students
--    • Drop the unique key on email first, then the column
--    • Drop student_name column
--    • Make mykad_number nullable (student may not supply it at
--      registration time)
-- ----------------------------------------------------------
ALTER TABLE `students`
    DROP KEY `email`,
    DROP COLUMN `email`,
    DROP COLUMN `student_name`,
    MODIFY COLUMN `mykad_number` CHAR(12) NULL;

-- ----------------------------------------------------------
-- 4. users
--    student_id is INT to match students.student_id (int PK)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `user_id`           CHAR(36)     NOT NULL DEFAULT (UUID()),
    `email`             VARCHAR(255) NOT NULL,
    `password`          VARCHAR(255) NOT NULL,
    `name`              VARCHAR(100) NOT NULL,
    `type`              ENUM('ADMIN','HEAD_LECTURER','LECTURER','STUDENT') NOT NULL,
    `status`            ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `is_email_verified` TINYINT(1)   NOT NULL DEFAULT 0,
    `email_verified_at` TIMESTAMP    NULL,
    `student_id`        INT          NULL,
    `lecturer_id`       CHAR(36)     NULL,
    `head_lecturer_id`  CHAR(36)     NULL,
    `created_at`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uq_users_email` (`email`),
    FOREIGN KEY (`student_id`)       REFERENCES `students`(`student_id`)             ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`lecturer_id`)      REFERENCES `lecturers`(`lecturer_id`)           ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`head_lecturer_id`) REFERENCES `head_lecturers`(`head_lecturer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
