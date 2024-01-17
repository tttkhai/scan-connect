import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', default: '', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', default: '', length: 50, nullable: false })
  lastName: string;

  @Column({ default: '', nullable: false })
  birthday: Date;

  @Column({ default: '', length: 50, nullable: false })
  email: string;

  @Column({ default: '', length: 50 })
  phone: string;

  @Column({ default: '', length: 50 })
  website: string;

  @Column({ default: '', length: 50 })
  title: string;

  @Column({ name: 'created_date' })
  createdDate: Date;

  @Column({ name: 'updated_date' })
  updatedDate: Date;

  @Column({ name: 'link_id' })
  linkId: string;

  @Column({ name: 'qr_path' })
  qrPath: string;

  @Column({ name: 'avatar_path' })
  avatarPath: string;
}
