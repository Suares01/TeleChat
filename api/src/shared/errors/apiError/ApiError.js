import httpStatusCodes from 'http-status-codes';

export class ApiError {
  static format({ message, code, codeAsString, description }) {
    return {
      ...{
        message,
        code,
        error: codeAsString
          ? codeAsString
          : httpStatusCodes.getStatusText(code),
      },
      ...(description && { description }),
    };
  }
}
