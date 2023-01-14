import { JWTServicesInterface } from '@fvsystem/fvshop-shared-entities';

export class CheckTokenService {
  constructor(
    private readonly jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>
  ) {}

  async checkToken(
    token: string,
    rolesAccepted: string[]
  ): Promise<{ id: string; email: string; roles: string[] }> {
    const payload = await this.jwtService.verify(token, {});
    const result = rolesAccepted.reduce(
      (acc, role) => acc || payload.scope.includes(role),
      false
    );

    if (!result) {
      throw new Error('Unauthorized');
    }
    return {
      id: payload.userId,
      email: payload.email,
      roles: payload.scope,
    };
  }
}
