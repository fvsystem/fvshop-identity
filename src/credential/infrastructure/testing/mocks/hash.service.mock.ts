/* istanbul ignore file */

export const hashMock = {
  compare: jest.fn().mockImplementation((password, hash) => {
    if (password === 'validHFH676' && hash === 'jfhdksjfdsjkfhdskjfhdsjkfhfh') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }),
  hash: jest.fn().mockReturnValue('jfhdksjfdsjkfhdskjfhdsjkfhfh'),
};
