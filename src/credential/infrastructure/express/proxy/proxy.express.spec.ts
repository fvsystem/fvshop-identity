import axios from 'axios';

import { CredentialFacadeImplRest } from './proxy.express';

jest.mock('axios');

describe('ClientExpress', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should throw an error when trying to login among services', async () => {
    const clientExpress = new CredentialFacadeImplRest('domain', 3000);
    await expect(
      clientExpress.verifyCredential.execute({
        email: 'email',
        password: 'password',
      })
    ).rejects.toThrowError('This method is not intended to use among services');
  });

  it('should call the server when trying to register', async () => {
    const clientExpress = new CredentialFacadeImplRest('domain', 3000);
    const postSpy = jest.spyOn(axios, 'post');
    postSpy.mockResolvedValue({ data: {} });
    await clientExpress.createCredential.execute({
      email: 'email',
      password: 'password',
      userId: 'userId',
    });
    expect(postSpy).toBeCalledWith('http://domain:3000/register', {
      email: 'email',
      password: 'password',
      userId: 'userId',
    });
  });
});
