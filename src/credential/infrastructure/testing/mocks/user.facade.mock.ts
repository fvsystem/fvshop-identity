/* istanbul ignore file */

import { NotFoundError } from '@fvsystem/fvshop-shared-entities';
import { UserDataDTO } from '@fvsystem/fvshop-user-manager';

export function getUserFacade(uuidValue: string, userData: UserDataDTO) {
  return {
    getUserById: {
      execute: jest.fn().mockImplementation(({ id }) => {
        if (id === uuidValue) {
          return Promise.resolve({ user: userData });
        }
        return Promise.reject(new NotFoundError('User not found'));
      }),
    },
    getUserByEmail: {
      execute: jest.fn().mockImplementation(({ email }) => {
        if (email === 'test@test.com') {
          return Promise.resolve({ user: userData });
        }
        return Promise.reject(new NotFoundError('User not found'));
      }),
    },
    createUser: {
      execute: jest.fn(),
    },
    getAllUsers: {
      execute: jest.fn(),
    },
  };
}
