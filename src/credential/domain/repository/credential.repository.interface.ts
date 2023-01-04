import { RepositoryInterface } from '@fvsystem/fvshop-shared-entities';
import { CredentialEntity } from '../entity';

export interface CredentialRepositoryInterface
  extends RepositoryInterface<CredentialEntity> {
  findByEmail(email: string): Promise<CredentialEntity | null>;
}
