export default function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const payload = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message,
  };
  if (error.errors) payload.errors = error.errors;
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) payload.message = error.message;
  res.status(statusCode).json(payload);
}
