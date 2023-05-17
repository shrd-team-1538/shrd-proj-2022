import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Device } from "./Device";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  name: string;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  text: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Device, (device) => device.posts)
  device: Device;
}
