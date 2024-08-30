import { FetchErrorHandlerOptions, fetchErrorHandler } from '.';

describe('fetchErrorHandler', () => {
  it('should handle a string error', () => {
    const error = 'Some runtime error';
    const errorHandlerOptions: FetchErrorHandlerOptions = {
      error,
      onError: jest.fn()
    };

    fetchErrorHandler(errorHandlerOptions);

    expect(errorHandlerOptions.onError).toBeCalledWith({
      message: 'Some runtime error',
      statusCode: 500
    });
  });

  it('should handle an error from the API type ErrorObject ', () => {
    const error = { message: 'Some api generated error', statusCode: 401 };

    const errorHandlerOptions: FetchErrorHandlerOptions = {
      error,
      onError: jest.fn()
    };

    fetchErrorHandler(errorHandlerOptions);

    expect(errorHandlerOptions.onError).toBeCalledWith(error);
  });

  it('should handle an unknown error', () => {
    const error = {} as unknown;

    const errorHandlerOptions = {
      error,
      onError: jest.fn()
    };

    fetchErrorHandler(errorHandlerOptions);

    expect(errorHandlerOptions.onError).toBeCalledWith({
      message: 'Something went wrong',
      statusCode: 500
    });
  });
});
