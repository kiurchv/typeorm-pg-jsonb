import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

import { Profile } from "./Profile";
import { Photo } from "./Photo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column("jsonb")
  profile: Profile;
}
