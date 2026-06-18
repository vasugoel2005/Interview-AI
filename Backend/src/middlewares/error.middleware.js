// Async handler wrapper to catch async/await errors without try-catch boilerplates
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

// Global Express error handling middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack)

    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        message,
        error: process.env.NODE_ENV === "production" ? {} : { stack: err.stack }
    })
}

module.exports = {
    catchAsync,
    errorHandler
}
