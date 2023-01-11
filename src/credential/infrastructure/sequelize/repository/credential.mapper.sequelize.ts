import {
  CredentialEntity,
  CredentialFactory,
  CredentialDTO,
} from '@root/credential/domain';

export class CredentialMapper {
  public static mapToEntity(credential: CredentialDTO): CredentialEntity {
    return CredentialFactory.createFromDTO(credential);
  }

  public static mapToModel(credential: CredentialEntity): CredentialDTO {
    return {
      email: credential.email,
      password: credential.passwordHashed,
      id: credential.id,
    };
  }
}
