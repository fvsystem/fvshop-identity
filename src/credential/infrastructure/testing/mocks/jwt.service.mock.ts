/* istanbul ignore file */

export function getJWTServiceMock(uuidValue: string) {
  return {
    sign: jest.fn().mockReturnValue('token'),
    verify: jest.fn().mockImplementation((token) => {
      if (token === 'token') {
        return Promise.resolve({
          userId: uuidValue,
          email: 'test@test.com',
          scope: ['user'],
        });
      }
      return Promise.reject(new Error('Invalid token'));
    }),
  };
}
