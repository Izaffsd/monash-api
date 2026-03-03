import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import routes from './src/routes/index.js'
import { errorHandler } from './src/middleware/errorHandler.middleware.js'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// serve frontend
app.use(express.static(path.join(__dirname, "../public")))

// Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined')) // full log
} else {
    app.use(morgan('dev'))
}

// CORS Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://devlopmentserver.com'], // dev server process.env.CORS_ORIGINS?
  credentials: true
}))

// client sent json -> auto parse to JS object
app.use(express.json())

app.use('/api', routes)

app.use(express.static('public'))

// all routes 404 handler (create error)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    errorCode: 'RESOURCE_NOT_FOUND_404'
  })
})

// Global error handler (LAST)
app.use(errorHandler)


export default app