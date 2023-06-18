import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @Column('varchar')
  nombreCompleto: string;

  @Column('varchar', {
    select: false,
  })
  password: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('datetime')
  fechaActualizacion: Date;

  @Column('json', {
    // default: 'user',
  })
  roles: string[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
