import { RepositorySequelize } from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  CredentialDTO,
  CredentialRepositoryInterface,
} from '@root/credential/domain';
import { Model, ModelCtor } from 'sequelize-typescript';

export class CredentialRepositorySequelize
  extends RepositorySequelize<CredentialEntity, CredentialDTO>
  implements CredentialRepositoryInterface
{
  constructor(
    model: ModelCtor<Model<CredentialDTO>>,
    toEntity: (props: CredentialDTO) => CredentialEntity,
    toModel: (credential: CredentialEntity) => CredentialDTO
  ) {
    super(model, toEntity, toModel);
  }

  async findByEmail(email: string): Promise<CredentialEntity | null> {
    const credentialModel = await this.model.findOne({
      where: { email },
    });
    return this.toEntity(credentialModel.dataValues);
  }
}
