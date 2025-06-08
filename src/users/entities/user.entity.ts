import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserType } from '../enums/user-type.enum';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CUSTOMER,
  })
  type: UserType;

  @OneToMany(() => Product, (product) => product.customer)
  products: Product[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
