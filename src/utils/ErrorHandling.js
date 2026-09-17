import { ApiError } from "./apiErrorHandling.js"
const apiErrorHandling = (err, req, res, next) => {
    
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"

    res.status(statusCode).json({
        success: false,
        message: message,
        error: err.error || []
    })
}

export { ApiError, apiErrorHandling }