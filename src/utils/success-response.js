export const successRes = (
    res,
    data,
    statusCode = 200,
    message = "success"
) => {
    return res.status(statusCode).json({
        statusCode,
        data,
        message,
    });
};
