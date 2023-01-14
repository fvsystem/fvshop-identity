/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      roles: string[];
      email: string;
    };
  }
}
