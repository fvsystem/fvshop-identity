import axios from 'axios';

import { CredentialFacadeImplRest } from './client.express';

jest.mock('axios');

describe('ClientExpress', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should call the server when trying to login', async () => {
    const clientExpress = new CredentialFacadeImplRest('domain');
    const postSpy = jest.spyOn(axios, 'post');
    postSpy.mockResolvedValue({ data: {} });
    await clientExpress.verifyCredential.execute({
      email: 'email',
      password: 'password',
    });
    expect(postSpy).toBeCalledWith('domain/login', {
      email: 'email',
      password: 'password',
    });
  });

  it('should call the server when trying to register', async () => {
    const clientExpress = new CredentialFacadeImplRest('domain');
    const postSpy = jest.spyOn(axios, 'post');
    postSpy.mockResolvedValue({ data: {} });
    await clientExpress.createCredential.execute({
      email: 'email',
      password: 'password',
      userId: 'userId',
    });
    expect(postSpy).toBeCalledWith('domain/register', {
      email: 'email',
      password: 'password',
      userId: 'userId',
    });
  });
});
