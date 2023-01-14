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

jest.mock('@grpc/proto-loader', () => ({
  loadSync: jest.fn().mockReturnValue({}),
}));

jest.mock('@grpc/grpc-js', () => ({
  credentials: {
    createInsecure: jest.fn(),
  },
  loadPackageDefinition: jest.fn().mockReturnValue({
    Register: jest.fn().mockImplementation(() => client),
  }),
}));

describe('GrpcProxy', () => {
  it('should call register service', () => {
    const proxy = new CredentialFacadeImplGrpc('localhost', 50051);
    proxy.createCredential.execute({
      email: 'test@test.com',
      password: 'validHFH676',
      userId: 'uuidValue',
    });
    expect(client.register).toBeCalledTimes(1);
  });

  it('should throw an error when trying to login', async () => {
    const proxy = new CredentialFacadeImplGrpc('localhost', 50051);
    await expect(() =>
      proxy.verifyCredential.execute({
        email: 'test@test.com',
        password: 'validHFH676',
      })
    ).rejects.toThrow();
  });
});
