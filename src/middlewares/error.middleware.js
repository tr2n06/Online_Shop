export const notFoundHandler = (req, res, next) => {
    const err = new Error("Cannot find this url");
    err.statusCode = 405;
    next(err);
}

export const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message || "Internal Server Error";
    error.statusCode = err.statusCode || 500;

    return res.status(error.statusCode).json({
        success: false,
        status: error.statusCode,
        message: error.message,
    });
}