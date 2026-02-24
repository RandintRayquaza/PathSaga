const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'An internal server error occurred'
            : err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

export default errorHandler;
