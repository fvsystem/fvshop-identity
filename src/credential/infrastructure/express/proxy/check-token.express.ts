import { JWTServicesInterface } from '@fvsystem/fvshop-shared-entities';
import { CheckTokenService } from '@root/credential/application';
import { NextFunction, Request, Response } from 'express';

export function checkTokenExpress(
  rolesAccepted: string[],
  jwtService: JWTServicesInterface<{
    email: string;
    userId: string;
    scope: string[];
  }>
) {
  const checkTokenService = new CheckTokenService(jwtService);
  return async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line dot-notation
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    }
    try {
      const result = await checkTokenService.checkToken(token, rolesAccepted);

      req.user = result;

      next();
    } catch (e) {
      res.status(401).send('Unauthorized');
    }
  };
}
