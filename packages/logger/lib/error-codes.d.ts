export declare enum ErrorCode {
    /** Generic Errors */
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    TIMEOUT = "TIMEOUT",
    /** ======================== Operational  Errors ======================= */
    BUFFER_OVERRUN = "BUFFER_OVERRUN",
    NUMERIC_FAULT = "NUMERIC_FAULT",
    /** ======================== Argument Errors ======================= */
    MISSING_NEW = "MISSING_NEW",
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    MISSING_ARGUMENT = "MISSING_ARGUMENT",
    UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT",
    CALL_EXCEPTION = "CALL_EXCEPTION",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    NONCE_EXPIRED = "NONCE_EXPIRED",
    REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED",
    UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT",
    TRANSACTION_REPLACED = "TRANSACTION_REPLACED"
}
export default ErrorCode;
//# sourceMappingURL=error-codes.d.ts.map