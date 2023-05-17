import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { User } from "./User";
import { Question } from "./Question";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  text: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
