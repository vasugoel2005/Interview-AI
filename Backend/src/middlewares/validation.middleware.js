const { z } = require("zod")

const registerSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be under 30 characters long")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Please enter a valid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be under 100 characters long")
})

const loginSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address"),
    password: z.string()
        .min(1, "Password is required")
})

function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation failed.",
                    errors: err.errors.map(e => e.message)
                })
            }
            next(err)
        }
    }
}

module.exports = {
    validate,
    registerSchema,
    loginSchema
}
