class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    ((this.statusCode = statusCode),
      (this.data = data),
      (this.message = message));
  }

  get success() {
    return this.success < 400;
  }
}

export { ApiResponse };
