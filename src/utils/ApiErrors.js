class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(messgae);
    ((this.statusCode = statusCode),
      (this.data = null),
      (this.message = message),
      (this.success = false),
      (this.error = errors));
  }
}

export { ApiError };
