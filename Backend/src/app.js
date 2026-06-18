const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const { errorHandler } = require("./middlewares/error.middleware")

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. Postman, server-to-server)
        if (!origin) return callback(null, true)

        if (allowedOrigins.some(allowed => origin === allowed)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* central error handling middleware */
app.use(errorHandler)

module.exports = app