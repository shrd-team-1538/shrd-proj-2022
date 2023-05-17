import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Device } from "./Device";
import { Answer } from "./Answer";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  text: string;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  name: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @ManyToOne(() => Device, (device) => device.questions)
  device: Device;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
