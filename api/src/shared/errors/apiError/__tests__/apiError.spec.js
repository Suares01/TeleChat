import { ApiError } from '../ApiError';

describe('ApiError', () => {
  it('should format error with mandatory fields', () => {
    const error = ApiError.format({
      message: 'User not found',
      code: 404,
    });

    expect(error).toEqual({
      ...error,
      error: 'Not Found',
    });
  });

  it('should format error with mandatory fields using codeAsString field', () => {
    const error = ApiError.format({
      message: 'User not found',
      code: 404,
      codeAsString: 'Not Found',
    });

    expect(error).toEqual({
      ...error,
      error: 'Not Found',
    });
  });

  it('should format error with mandatory fields and description', () => {
    const error = ApiError.format({
      message: 'User not found',
      code: 404,
      description: "This error happens when there isn't user created",
    });

    expect(error).toEqual({
      ...error,
      error: 'Not Found',
    });
  });
});
