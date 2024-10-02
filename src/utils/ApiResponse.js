class ApiResponse {
    constructor(
        success,
        statusCode,
        message = "success",
        data = {}
    ) {
        this.success = success
        this.statusCode = statusCode
        this.message = message
        this.data = data
    }
}

export default ApiResponse;