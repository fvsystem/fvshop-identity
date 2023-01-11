import { CredentialDTO } from '@root/credential/domain';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'credentials' })
export class CredentialModel extends Model<CredentialDTO, CredentialDTO> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare password: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare email: string;
}
