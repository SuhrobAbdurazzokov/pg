export const globalError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    return res.status(statusCode).json({
        statusCode,
        message,
    });
};
