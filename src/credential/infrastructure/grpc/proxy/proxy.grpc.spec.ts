import { RegisterClient } from '../proto';
import { CredentialFacadeImplGrpc } from './proxy.grpc';

const client = {
  register: jest.fn(),
  Register: jest.fn(),
  close: jest.fn(),
  getChannel: jest.fn(),
  waitForReady: jest.fn(),
  checkOptionalUnaryResponseArguments: jest.fn(),
  makeUnaryRequest: jest.fn(),
  makeClientStreamRequest: jest.fn(),
  checkMetadataAndOptions: jest.fn(),
  makeServerStreamRequest: jest.fn(),
  makeBidiStreamRequest: jest.fn(),
};

describe('GrpcProxy', () => {
  it('should call register service', () => {
    const proxy = new CredentialFacadeImplGrpc(
      client as unknown as RegisterClient
    );
    proxy.createCredential.execute({
      email: 'test@test.com',
      password: 'validHFH676',
      userId: 'uuidValue',
    });
    expect(client.register).toBeCalledTimes(1);
  });

  it('should throw an error when trying to login', async () => {
    const proxy = new CredentialFacadeImplGrpc(
      client as unknown as RegisterClient
    );
    await expect(() =>
      proxy.verifyCredential.execute({
        email: 'test@test.com',
        password: 'validHFH676',
      })
    ).rejects.toThrow();
  });
});
