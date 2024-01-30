import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: false })
  lastName: string;

  @Column({ default: '', length: 50, nullable: false })
  gender: string;

  @Column({ default: '', type: 'timestamptz', nullable: false })
  birthday: Date;

  @Column({ default: '', length: 50, nullable: false })
  email: string;

  @Column({ default: '', length: 15 })
  phone: string;

  @Column({ default: '', length: 50 })
  website: string;

  @Column({ default: '', length: 50 })
  title: string;

  @Column({ name: 'created_date', type: 'timestamptz', default: () => 'NOW()' })
  createdDate: Date;

  @Column({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;

  @Column({ name: 'link_id' })
  linkId: string;

  @Column({ name: 'qr_path' })
  qrPath: string;

  @Column({ name: 'avatar_path' })
  avatarPath: string;

  @Column({ name: 'is_private' })
  isPrivate: boolean;
}
